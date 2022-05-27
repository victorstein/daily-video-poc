import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useCallState } from '@custom/shared/contexts/CallProvider';
import PropTypes from 'prop-types';

export const ChatContext = createContext();
// { message, room, recipientsIds }
export const ChatProvider = ({ children }) => {
  const { callObject } = useCallState();
  const [ chatHistoryByRoom, setChatHistoryByRoom ] = useState({});

  const sendChatMessage = (input) => {
    if (!callObject) return;

    const messageInput = {
      type: 'chat-message',
      payload: input,
    }

    input.recipientsIds.forEach(id => {
      callObject.sendAppMessage({ message: messageInput }, id);
    })

    handleChatMessage(messageInput);
  }

  const handleChatMessage = ({ payload }) => {
    console.log('handleChatMessage', payload);
    const { id, senderID, senderName, message, room } = payload

    setChatHistoryByRoom(prevState => ({
      ...prevState,
      [room]: [
        ...(prevState[room] || []),
        { id, senderName, senderID, message }
      ],
    }))
  }

  // map app messages to appropriate handlers
  const handleAppMessage = async (e) => {
    console.info('handleAppMessage', e);

    const handlers = {
      'chat-message': handleChatMessage,
    }

    const eventType = e.data.message.type;
    const handler = handlers[eventType];
    if (!handler) {
      console.warn(`No handler for ${eventType}`);
      return;
    }

    await handler(e.data.message)
  };

  useEffect(() => {
    if (!callObject) return;

    console.log(`💬 Chat provider listening for app messages`);

    callObject.on('app-message', handleAppMessage);

    return () => callObject.off('app-message', handleAppMessage);
  }, [callObject, handleAppMessage]);

  return (
    <ChatContext.Provider
      value={{
        sendChatMessage,
        chatHistoryByRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node,
};

export const useChat = () => useContext(ChatContext);
