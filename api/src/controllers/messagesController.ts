// Installed Utils
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import axios from 'axios';

// App Utils
import i18n from '../i18n.config';
import { sanitizeInput } from '../utils/sanitize';
import threads from '../models/threadsModel';
import messages from '../models/messagesModel';
import AuthenticatedRequest from '../types/ExpressRequest';

/**
 * Handle the reply creation
 *
 * @param AuthenticatedRequest req
 * @param Response res
 */
const newReply = async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }

  // Extract reply from body
  const { reply } = req.body;

  // Get the dynamic parameter attribute
  const sanitizedThreadId = sanitizeInput(req.params.threadId);

  // Get the user data
  const { user } = req; 

  // Sanitize the reply
  const sanitizedReply = sanitizeInput(reply);

  // Interface for thread
  interface Thread {
    sender: string;
    network: {
      net_id: string;
      token: string;
    }
  }

  try {

    // Get thread by recipient
    const thread: Thread | null = await threads.findOne<Thread>({
      _id: {_id: sanitizedThreadId}, user: {_id: user?._id}
    })
    .populate({
      path: 'network',
      select: 'token net_id'
    });

    // Check if thread exists
    if ( thread ) {

      // Prepare the message response
      const messageResponse = {
        recipient: {
          id: thread.sender
        },
        messaging_type: 'RESPONSE',
        message: {
          text: sanitizedReply
        }
      };

      // Send reply
      const replyStatus = await axios.post(
        `https://graph.facebook.com/${process.env.FACEBOOK_API_VERSION}/me/messages?access_token=${thread.network.token}`,
        messageResponse,
        {
          headers: {
            'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)'
          },
          timeout: 30000
        }
      );

      // Verify if replyStatus exists
      if ( replyStatus.data ) {

        // Extract the message's ID
        const { message_id } = replyStatus.data as { message_id: string };

        // Create a new message
        await messages.create({
          user: user,
          thread: {_id: sanitizedThreadId},
          net_id: message_id,
          body: sanitizedReply,
          page_owner: true
        });

      }

      // Return success message
      return res.status(200).json({
        success: true,
        message: i18n.__('reply_was_created_successfully'),
      });      

    } else {

      // Return error message
      return res.status(200).json({
        success: false,
        message: i18n.__('thread_was_not_found'),
      });

    }

  } catch (error: unknown) {
    console.error(`${error instanceof Error ? error.message : i18n.__('an_unknown_error_occurred')}`);
  }

};

/**
 * Handle the messages list requests
 *
 * @param AuthenticatedRequest req
 * @param Response res
 */
const messagesList = async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }

  // Extract page from body
  const { page } = req.body;

  // Get the dynamic parameter attribute
  const threadId = sanitizeInput(req.params.threadId);

  // Sanitized page number
  const sanitized_page = ((page?parseInt(sanitizeInput(page)):1) - 1);  

  // Get the user data
  const { user } = req;  

  // Displayed number of rows
  const pageSize = 10;

  // Calculate number of results to skip
  const skip = sanitized_page * pageSize;

  try {

    // Get the messages list
    const messagesList = await messages.find({user: user, thread: {_id: threadId}})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .populate({
      path: 'thread',
      select: 'sender_name'
    });

    // Total number of messages
    const totalResults = await messages.countDocuments({user: user, thread: {_id: threadId}});

    // Return default response
    return res.status(200).json({
      success: true,
      content: {
        messages: messagesList,
        total: totalResults,
        time: new Date().toISOString()
      }
    });

  } catch (error: unknown) {
    console.error(`${error instanceof Error ? error.message : i18n.__('an_unknown_error_occurred')}`);
    // Return error message
    return res.status(200).json({
      success: false,
      message: i18n.__('no_messages_were_found'),
    });
  }

};

export { newReply, messagesList };
