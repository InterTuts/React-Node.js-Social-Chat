// Installed Utils
import { Response } from 'express';
import { validationResult } from 'express-validator';

// App Utils
import i18n from '../i18n.config';
import { sanitizeInput } from '../utils/sanitize';
import threads from '../models/threadsModel';
import messages from '../models/messagesModel';
import AuthenticatedRequest from '../types/ExpressRequest';

/**
 * Handle the threads list requests
 *
 * @param AuthenticatedRequest req
 * @param Response res
 */
const threadsList = async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }

  // Extract search from body
  const { search, page } = req.body;

  // Sanitized search
  const sanitized_search = search?sanitizeInput(search):'';

  // Sanitized page number
  const sanitized_page = ((page?parseInt(sanitizeInput(page)):1) - 1);  

  // Get the user data
  const { user } = req;  

  // Displayed number of rows
  const pageSize = 10;

  // Calculate number of results to skip
  const skip = sanitized_page * pageSize;

  try {

    // Verify if search key exists
    if ( sanitized_search.length > 0 ) {

      // Query the Messages collection manually
      const messagesList = await messages.find({
        user: user,
      }).select('thread body sender_name createdAt');

      // Verify if messages exists
      if ( messagesList.length < 1 ) {

        // Return error message
        return res.status(200).json({
          success: false,
          message: i18n.__('no_threads_were_found'),
        });

      }
      
      // Filter messages with regex after converting the buffer to string
      const filteredMessages = messagesList.filter(message => {
        const bodyString = message.body.toString('utf-8'); 
        return bodyString.match(new RegExp(sanitized_search, 'i'));
      });

      // Verify if messages exists
      if ( filteredMessages.length < 1 ) {

        // Return error message
        return res.status(200).json({
          success: false,
          message: i18n.__('no_threads_were_found'),
        });

      }

      // Extract thread IDs from the filtered messages
      const threadIds = filteredMessages.map(message => message.thread);

      // Get the threads by user and ids
      const threadsList = await threads.find({
        user: user,
        _id: { $in: threadIds }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);  

      // Total number of threads
      const totalResults = await threads.countDocuments({
        user: user,
        _id: { $in: threadIds }
      });

      // Return default response
      return res.status(200).json({
        success: true,
        content: {
          threads: threadsList,
          total: totalResults,
          time: new Date().toISOString()
        }
      });

    } else {

      // Get the threads list
      const threadsList = await threads.find({user: user})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

      // Verify if messages exists
      if ( threadsList.length < 1 ) {

        // Return error message
        return res.status(200).json({
          success: false,
          message: i18n.__('no_threads_were_found'),
        });

      }

      // Total number of threads
      const totalResults = await threads.countDocuments({user: user});

      // Return default response
      return res.status(200).json({
        success: true,
        content: {
          threads: threadsList,
          total: totalResults,
          time: new Date().toISOString()
        }
      });

    }

  } catch (error: unknown) {
    console.error(`${error instanceof Error ? error.message : i18n.__('an_unknown_error_occurred')}`);
    // Return error message
    return res.status(200).json({
      success: false,
      message: i18n.__('no_threads_were_found'),
    });
  }

};

export { threadsList };
