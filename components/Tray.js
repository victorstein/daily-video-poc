import React from 'react';

import { TrayButton } from '@custom/shared/components/Tray';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { ReactComponent as IconBreakout } from '../shared/icons/breakout-sm.svg';
import { ReactComponent as IconChat } from '../shared/icons/chat-md.svg';
import { BREAKOUT_ROOM_MODAL } from './BreakoutRoomModal';
import { useBreakoutRoom } from './BreakoutRoomProvider';
import { CHAT_ASIDE } from '../shared/components/Aside/ChatAside';

export const Tray = () => {
  const { openModal, toggleAside } = useUIState();
  const { isActive, endBreakoutRooms, broadcastMessage } = useBreakoutRoom();
  const { localParticipant } = useParticipants();
  const userIsOwner = localParticipant.isOwner;

  const handleSession = () => {
    if (isActive) endBreakoutRooms();
    else openModal(BREAKOUT_ROOM_MODAL);
  }

  return (
    <>
      <TrayButton
        label="Chat"
        onClick={() => {
          toggleAside(CHAT_ASIDE);
        }}
      >
        <IconChat />
      </TrayButton>
      { userIsOwner && (
        <TrayButton
          label={isActive ? 'End' : 'Breakout'}
          orange={isActive}
          onClick={handleSession}>
          <IconBreakout />
        </TrayButton>
      )}
      { (userIsOwner && isActive) && (
        <TrayButton
          label={'broadcast'}
          onClick={broadcastMessage}
        >
          <IconBreakout />
        </TrayButton>
      )}
    </>
  );
};

export default Tray;
