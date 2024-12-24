// Installed Utils
import { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';

// App Utils
import i18n from '../i18n.config';
import { sanitizeInput } from '../utils/sanitize';
import networks from '../models/networksModel';
import threads from '../models/threadsModel';
import messages from '../models/messagesModel';

/**
 * Handle the webhook requests
 *
 * @param Request req
 * @param Response res
 */
const webhook = async (req: Request, res: Response) => {

  // Extract the first `entry` object and its messaging array
  const entries = req.body.entry || [];
  const id = entries.flatMap((entry: any) => entry.id || '');
  const messagingEvents = entries.flatMap((entry: any) => entry.messaging || []);

  // Extract message IDs and texts from all messaging events
  const extractedData = messagingEvents.map((event: any) => {
    return {
      senderId: sanitizeInput(event.sender?.id),
      recipientId: sanitizeInput(event.recipient?.id),
      messageId: sanitizeInput(event.message?.mid),
      messageText: sanitizeInput(event.message?.text)
    };
  });

  // Get account's data by slug
  const account = await networks.findOne({net_id: extractedData[0].recipientId});

  // Verify if account was found
  if ( account ) {

    try {

      // Get thread by recipient
      const thread = await threads.findOne({network: {_id: account._id}});

      // Check if thread exists
      if ( thread ) {

        // Create a new message
        await messages.create({
          user: account.user,
          thread: { _id: thread._id },
          net_id: extractedData[0].messageId,
          body: extractedData[0].messageText,
          page_owner: false
        });

        // Update the thread
        await threads.findByIdAndUpdate(
          thread._id,
          { $set: { new: true } },
          { new: true }
        );

      } else {

        // Subscribe params
        const params = {
          access_token: account.token
        };

        // Url for app subscribe
        const url = `https://graph.facebook.com/${process.env.FACEBOOK_API_VERSION}/${extractedData[0].senderId}?${querystring.stringify(params)}`;

        // Get user's data
        const senderData = await axios.get<{ first_name: string; last_name: string }>(url, {
          headers: {
              'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)'
          },
          timeout: 30000
        });
 
        // Create a new thread
        const createdThread = await threads.create({
          user: account.user,
          label_id: id[0],
          sender: extractedData[0].senderId,
          network: {_id: account._id},
          sender_name: senderData.data?senderData.data.first_name + ' ' + senderData.data.last_name:i18n.__('guest'),
          new: false
        });

        // Create a new message
        await messages.create({
          user: account.user,
          thread: { _id: createdThread._id },
          net_id: extractedData[0].messageId,
          body: extractedData[0].messageText,
          page_owner: false
        });

      }

    } catch (error: unknown) {
      console.error(`${error instanceof Error ? error.message : i18n.__('an_unknown_error_occurred')}`);
    }

  }

  // Return default response
  return res.status(200).json({
    success: true,
    message: 'ok'
  });

};

export { webhook };
