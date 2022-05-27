import React, { useEffect, useRef, useState } from 'react';
import { Aside } from '@custom/shared/components/Aside';
import Button from '@custom/shared/components/Button';
import { TextInput } from '@custom/shared/components/Input';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { useChat } from '@custom/shared/contexts/ChatProvider';
import { nanoid } from 'nanoid';
import { useBreakoutRoom } from 'components/BreakoutRoomProvider';

export const CHAT_ASIDE = 'chat';

export const ChatAside = () => {
  const { showAside, setShowAside } = useUIState();
  const { sendChatMessage, chatHistoryByRoom } = useChat();
  const { localParticipant } = useParticipants();
  const [ currentRoom, setCurrentRoom ] = useState('main');
  const [ newMessage, setNewMessage ] = useState('');
  const { breakoutRoomsMap, breakoutRoomByUser, unassignedUsersIds } = useBreakoutRoom() // ideally this would come from a sharedState context of some sort
  const chatWindowRef = useRef();

  useEffect(() => {
    setCurrentRoom(breakoutRoomByUser[localParticipant.user_id] ?? 'main');
  }, [breakoutRoomByUser])

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistoryByRoom?.length]);

  const onSendMessage = (e) => {
    e.preventDefault();

    const room = breakoutRoomByUser[localParticipant.user_id] ?? currentRoom

    sendChatMessage({
      id: nanoid(),
      message: newMessage,
      senderId: localParticipant.user_id,
      senderName: localParticipant.name,
      room,
      recipientsIds: breakoutRoomsMap[room] ? Object.keys(breakoutRoomsMap[room]) : unassignedUsersIds,
    });
    setNewMessage('');
  }

  const isLocalUser = (id) => id === localParticipant.user_id;

  if (!showAside || showAside !== CHAT_ASIDE) {
    return null;
  }

  const chatHistory = chatHistoryByRoom[currentRoom] || [];

  return (
    <Aside onClose={() => setShowAside(false)}>
      <p>Current room: {currentRoom}</p>
      <div className="messages-container" ref={chatWindowRef}>
        {chatHistory.map((chatItem) => (
          <div
            className={isLocalUser(chatItem.senderID) ? 'message local' : 'message'}
            key={chatItem.id}
          >
            <span className="sender">{chatItem.senderName}</span>
            <span className="content">{chatItem.message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={onSendMessage}>
        <footer className="chat-footer">
          <TextInput
            value={newMessage}
            placeholder="Type message here"
            variant="transparent"
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            className="send-button"
            variant="transparent"
            disabled={!newMessage}
            type="submit"
          >
            Send
          </Button>
        </footer>
      </form>
      <style jsx>{`
        .messages-container {
          flex: 1;
          overflow-y: scroll;
        }

        .message {
          margin: var(--spacing-xxs);
          padding: var(--spacing-xxs);
          background: var(--gray-wash);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }

        .message.local {
          background: var(--gray-light);
        }

        .message.local .sender {
          color: var(--primary-dark);
        }

        .content {
          display: block;
          font-size: 0.9rem;
        }

        .sender {
          font-weight: var(--weight-medium);
          font-size: 0.75rem;
          color: gray;
        }

        .chat-footer {
          flex-flow: row nowrap;
          box-sizing: border-box;
          padding: var(--spacing-xxs) 0;
          display: flex;
          position: relative;
          border-top: 1px solid var(--gray-light);
        }

        .chat-footer :global(.input-container) {
          flex: 1;
        }

        .chat-footer :global(.input-container input) {
          padding-right: 0px;
        }

        .chat-footer :global(.send-button) {
          padding: 0 var(--spacing-xs);
        }
      `}</style>
    </Aside>
  );
};

export default ChatAside;
