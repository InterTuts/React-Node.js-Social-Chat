'use client';

// Installed Utils
import {useTranslations} from 'next-intl';
import { useRef, useEffect, useState, SetStateAction } from 'react';
import { Box, Button, chakra, Flex, HStack, List, Textarea, VStack } from '@chakra-ui/react';
import {
  HiArrowUp,
  HiShare,
  HiClock,
  HiRefresh
} from "react-icons/hi";
import { motion } from "framer-motion";

// App Utils
import type ApiResponse from '@/lib/models/ApiResponse';
import axios, { type AxiosResponse } from '@/axios';
import { calculateTime, toTimeStamp } from '@/lib/utils/time';
import toast, { Toaster } from 'react-hot-toast';

// Create the user's chat component
const Chat = ({ threadId }: { threadId: string }) => {

  /**
   * Sanitize the thread's id
   * 
   * @param threadId
   * 
   * @returns sanitized thread's id
   */
  const sanitizeThreadId = (threadId: string): string => {
    return threadId?threadId.replace(/[^a-zA-Z0-9-_]/g, ''):'';
  }

  // Santize the thread's ID
  const sanitizedThreadId = sanitizeThreadId(threadId);

  // Set a hook for loading messages
  const [isLoading, setIsLoading] = useState(true);

  // Set a hook for replying
  const [isReplying, setIsReplying] = useState(false);

  // Set a hook for messages
  const [messages, setMessages] = useState<{
    list: { _id: string; body: string; page_owner: boolean; thread: {
      sender_name: string
    } }[] | {};
    serverTime: string;
    total: number;
    page: number
  }>({ list: [], serverTime: '', total: 0, page: 1});

  // Set a hook for reply
  const [reply, setReply] = useState('');

  // Set a hook for no thread found
  const [threadFound, setNoThreadFound] = useState(true);

  // Reference for card body
  const cardBodyRef = useRef<HTMLDivElement | null>(null);

  // Reference for conversation
  const conversationRef = useRef<HTMLUListElement | null>(null);

  // Get the words by group
  const t = useTranslations('account');

  // Run code after page load
  useEffect(() => {

    // Get the messages list
    messagesList(1);

    // Open a web socket connection
    const socket = new WebSocket(process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') + 'user/websocket');

    // Send the thread id when the connection is opened
    socket.onopen = () => {
      socket.send(sanitizedThreadId);
    };
    
    // Listen for messages
    socket.onmessage = (event) => {
      
      // Check for new message
      if  (event.data === '1') {
        // Reload the messages list
        messagesList(1);
      }

    };

    // Cleanup
    return () => {
      // Close the connection
      socket!.close();
    };

  }, []);

  /**
   * Get all messages
   * 
   * @param number page
   */
  const messagesList = async (page: number, height: number = 0) => {

    // Enable is loading
    setIsLoading(true);

    try {

      // Get the thread's messages
      const response: AxiosResponse<ApiResponse<{
        messages: {
          _id: string,
          body: string,
          page_owner: boolean,
          thread: {
            sender_name: string
          }
        }[],
        time: string,
        total: number
      }>> = await axios.post(`api/user/threads/${sanitizedThreadId}`, {
        page: page
      });

      // Verify if no messages
      if ( !response.data.success ) {
        setNoThreadFound(false);
      }

      // Check if page number is 1
      if ( page === 1 ) {

        // Set pause
        setTimeout(() => {

          // Get card's body
          const cardBody = cardBodyRef.current;

          // Get conversation
          const conversation = conversationRef.current;

          // Verify if conversation exists
          if (!cardBody || !conversation) return;

          // Scroll messages
          cardBody.scrollTo({
            top: conversation.scrollTop + conversation.getBoundingClientRect().height,
            behavior: 'smooth',
          });

        }, 100);

        // Verify if threads exists
        if ( response.data.success && response.data.content ) {
          // Reorder messages
          const messagesDesc = response.data.content.messages.reverse();
          setMessages((prevMessages) => ({
            list: messagesDesc,
            serverTime: response.data.content!.time,
            total: response.data.content!.total,
            page: prevMessages.page + 1
          }));
        }

      } else {

        // Set pause
        setTimeout(() => {

          // Get card's body
          const cardBody = cardBodyRef.current;

          // Get conversation
          const conversation = conversationRef.current;

          // Verify if conversation exists
          if (!cardBody || !conversation) return;

          // Scroll messages
          cardBody.scrollTo({
            top: conversation.getBoundingClientRect().height - height,
            behavior: 'instant'
          });

        }, 100);

        // Verify if threads exists
        if ( response.data.success && response.data.content ) {
          // Reorder messages
          const messagesDesc = response.data.content.messages.reverse();
          setMessages((prevMessages) => ({
            list: Array.isArray(prevMessages.list)?[...messagesDesc, ...prevMessages.list]:messagesDesc,
            serverTime: response.data.content!.time,
            total: response.data.content!.total,
            page: prevMessages.page + 1
          }));
        }

      }

    } catch (error) {
      console.error(error);
    } finally {
      // Disable is loading
      setIsLoading(false);
    }
    
  };

  /**
   * Decode buffer string
   * 
   * @param buffer data
   * 
   * @returns text
   */
  const decodeBuffer = (buffer: { type: 'Buffer'; data: number[] }) => {

    // Turn into binary data
    const uint8Array = new Uint8Array(buffer.data);

    // Text decoder
    const decoder = new TextDecoder();

    // Decode binary data
    const text = decoder.decode(uint8Array);

    // Decode HTML entities
    const decodeHtmlEntities = (str: string) =>
      str.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));

    return decodeHtmlEntities(text);

  }

  // Load more messages
  const loadMoreMessages = () => {

    // Get conversation
    const conversation = conversationRef.current;

    // Check if conversation exists
    if ( conversation ) {
    
      // Get the messages list
      messagesList(messages.page, conversation.getBoundingClientRect().height);
      
    }

  };

  // Handle textarea change
  const handleTextareaChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setReply(e.target.value);
  };

  // Handle button click
  const handleReplySubmit = async () => {

    // Update the page
    setMessages((prevMessages) => ({
      ...prevMessages,
      page: 1
    }));

    // Show animation
    setIsReplying(true);

    try {

      // Get the thread's messages
      const response: AxiosResponse<ApiResponse<null>> = await axios.post(`api/user/threads/${sanitizedThreadId}/message`, {
        reply: reply
      });

      // Verify if the reply was created successfully
      if ( response.data.success ) {

        // Empty reply
        setReply('');

        // Display the success message
        toast(response.data.message, {
          style: {
            background: '#319795',
            color: '#FFFFFF'
          }
        });

        // Reload the messages list
        messagesList(1);

      } else {

        // Display the failed message
        toast(response.data.message, {
          style: {
            background: '#ef476f',
            color: '#FFFFFF'
          }
        });

      }

    } catch (error) {
      console.error(error);
    } finally {
      // Hide animation
      setIsReplying(false);
    }

  };

  const MotionIcon = motion.create(chakra.div);

  return (
    <>
      {(threadFound)?(
        <>
          <Toaster />
          <Box minHeight="calc(100vh - 64px)" bgColor="blue.200">
            <VStack
              height="calc(100vh - 184px)"
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#264e70',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'darkgray',
                },
              }}
              ref={cardBodyRef}
            >
              <List.Root className="messages" ref={conversationRef}>
                <List.Item textAlign="center">
                  <Button colorPalette="teal" variant="outline" className={messages.total <= (messages.page - 1) * 10?"load-more-messages load-more-messages-disabled":"load-more-messages"} onClick={() => loadMoreMessages()}>
                    {(isLoading)?(
                      <MotionIcon
                        marginTop="-3px"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <HiRefresh />
                      </MotionIcon>  
                    ):(
                      <HiArrowUp className="load-more-messages-icon" />
                    )}
                    { t('load_more_messages') }
                  </Button>
                </List.Item>
                {(Array.isArray(messages.list))?(
                  messages.list.map((message: any, index: number) => (
                    <List.Item className={!message.page_owner ? "guest-message" : "my-message"} key={index}>
                      <span>{!message.page_owner?message.thread.sender_name:t('me')}:</span>
                      { decodeBuffer(message.body) }
                      <Flex className="message-time">
                        <HiClock className="message-time-icon" />
                        { calculateTime(t, toTimeStamp(message.createdAt)/1000, toTimeStamp(messages.serverTime)/1000) }
                      </Flex>
                    </List.Item>
                  ))
                ):''}
              </List.Root>
            </VStack>
            <HStack>
              <Textarea
                placeholder={ t('enter_a_reply') }
                resize="none"
                margin="15px 0 15px 15px"
                padding="15px 15px"
                height="80px"
                width="calc(100% - 115px)"
                fontFamily="input"
                fontSize="14px"
                bgColor="green.400"
                value={reply}
                onChange={handleTextareaChange}  
              />
              <Button
                variant="solid"
                width="80px"
                height="80px"
                bgColor="green.300"
                color="#FFFFFF"
                onClick={handleReplySubmit}
              >
                {(isReplying)?(
                  <MotionIcon
                    marginTop="-3px"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <HiRefresh />
                  </MotionIcon>              
                ):(
                  <HiShare />
                )}
              </Button>
            </HStack>
          </Box>      
        </>
      ):(
        <Box marginTop="15px" px={4}>
          <List.Root className="list">
            <List.Item p="10px 15px" fontFamily="message" fontSize="14px" color="black.100">
              { t('no_thread_found') }
            </List.Item>
          </List.Root>
        </Box>
      )}
    </>);

}

// Export the user's chat component
export default Chat;