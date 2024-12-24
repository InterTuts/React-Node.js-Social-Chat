// Installed Utils
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { WebSocketServer } from 'ws';

// App Utils
import mongoDB from './configuration/db';
import authRoute from './routes/authRoutes';
import userRoute from './routes/userRoutes';
import webhookRoute from './routes/webhookRoutes';
import threads from './models/threadsModel';
import { sanitizeInput } from './utils/sanitize';
import mongoose from 'mongoose';

// Crează aplicația Express
const app = express();

// Crează serverul HTTP folosind Express
const server = http.createServer(app);

// Crează serverul WebSocket și leagă-l de serverul HTTP
const wss = new WebSocketServer({ server });

// Web Socket connection
wss.on('connection', (ws) => {

  // Variable to hold the current threadId
  let currentThreadId: string | null = null;

  // Function to verify data in the database
  const verifyDataExists = async (threadId: string) => {
    try {

      // Check if threadId is a valid ObjectId before querying
      if (!mongoose.Types.ObjectId.isValid(threadId)) {
        ws.send('Invalid threadId format');
        return;
      }

      // Get the thread
      const thread = await threads.findOne({ _id: {_id: threadId}, new: true  });
      if (thread) {
        // Update the thread
        await threads.findByIdAndUpdate(
          thread._id,
          { $set: { new: false } },
          { new: false }
        );
        ws.send(1);
      } else {
        ws.send(0);
      }
    } catch (error) {
      console.error(error);
      ws.send(0);
    }
  };

  // Continuously verify data every 5 seconds
  const verificationInterval = setInterval(() => {
    if ( currentThreadId ) {
      verifyDataExists(currentThreadId);
    }
  }, 5000);

  // Listen for messages
  ws.on('message', (message: string) => {

    // Turn to hex the message
    const buffer = Buffer.from(message, 'hex');

    // Sanitize thread ID
    currentThreadId = sanitizeInput(buffer.toString('utf8'));

    // Send thread id
    verifyDataExists(currentThreadId);
  });

  // Detect when the connection is closed
  ws.on('close', () => {
    // Clear the verification interval when the connection is closed
    clearInterval(verificationInterval);
  });
});

// Configurare Cors
app.use(
  cors({
    origin: process.env.WEBSITE_URL,
    optionsSuccessStatus: 200,
  }),
);

// Conectează-te la MongoDB
mongoDB();

// Permite parametri JSON
app.use(express.json());

// Setează rutele pentru autentificare
app.use('/api/auth', authRoute);

// Setează rutele pentru utilizator
app.use('/api/user', userRoute);

// Ruta pentru webhook
app.use('/webhook', webhookRoute);

// Run Express and WebSocket
const port = 5000;
server.listen(port, () => {
  console.log(`Server runs on port ${port}`);
});