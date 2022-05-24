import React from 'react';

import { TrayButton } from '@custom/shared/components/Tray';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { ReactComponent as IconBreakout } from '../shared/icons/breakout-sm.svg';
import { BREAKOUT_ROOM_MODAL } from './BreakoutRoomModal';
import { useBreakoutRoom } from './BreakoutRoomProvider';

export const Tray = () => {
  const { openModal } = useUIState();
  const { isActive, endSession, sendBreakoutAlert, broadcastMessage } = useBreakoutRoom();
  const { localParticipant } = useParticipants();

  const handleSession = () => {
    if (isActive) endSession();
    else openModal(BREAKOUT_ROOM_MODAL);
  }

  if (!localParticipant.isOwner && isActive) return (
    <TrayButton
      label={'Breakout alert!'}
      onClick={sendBreakoutAlert}
      bubble
    >
      <IconBreakout />
    </TrayButton>
  );

  return (
    <>
      <TrayButton
        label={isActive ? 'End' : 'Breakout'}
        orange={isActive}
        onClick={handleSession}>
        <IconBreakout />
      </TrayButton>
      { isActive && <TrayButton
        label={'broadcast'}
        onClick={broadcastMessage}
      >
        <IconBreakout />
      </TrayButton>}
    </>
  );
};

export default Tray;
