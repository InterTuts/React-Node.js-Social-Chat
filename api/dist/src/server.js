'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
require('dotenv/config');
// App Utils
const db_1 = __importDefault(require('./configuration/db'));
const authRoutes_1 = __importDefault(require('./routes/authRoutes'));
const userRoutes_1 = __importDefault(require('./routes/userRoutes'));
// Express App
const app = (0, express_1.default)();
// Default Port
const port = 5000;
// Cors Configuration
app.use(
  (0, cors_1.default)({
    origin: process.env.WEBSITE_URL,
    optionsSuccessStatus: 200,
  }),
);
// Connect to MongoDB
(0, db_1.default)();
// Allow JSON parameters
app.use(express_1.default.json());
// Set Routes for auth
app.use('/api/auth', authRoutes_1.default);
// Set Routes for user
app.use('/api/user', userRoutes_1.default);
// Run Express Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
