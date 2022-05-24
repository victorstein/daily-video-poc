import React, {
  createContext,
  useCallback,
  useContext,
  useEffect, useMemo,
  useState
} from 'react';
import { useCallState } from '@custom/shared/contexts/CallProvider';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';
import PropTypes from 'prop-types';
import {
  createBreakoutRoom,
  createBreakoutRoomParticipants, endBreakoutRoom, getBreakoutRoom,
  getBreakoutRoomsData,
  getRoomParticipantsByRoomId,
} from '../utils/lib';

export const BreakoutRoomContext = createContext();

export const BreakoutRoomProvider = ({ children }) => {
  const { callObject, roomInfo } = useCallState();
  const { participants, localParticipant } = useParticipants();
  const { setCustomCapsule } = useUIState();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [subParticipants, setSubParticipants] = useState([]);
  const [breakoutRooms, setBreakoutRooms] = useState({});

  const handleUserTrackSubscriptions = useCallback(async () => {
    const {isOwner} = localParticipant

    const owners = participants.filter(p => p.isOwner);
    const ownersIds = owners.map(g => g.user_id)
    const guests = participants.filter(p => !p.isOwner);
    const guestsIds = guests.map(g => g.user_id)

    setSubParticipants(isOwner ? ownersIds : guestsIds);
    setIsSessionActive(true);

    const tracksList = (isOwner ? ownersIds : guestsIds).reduce((acc, userId) => ({
      ...acc,
      [userId]: { setSubscribedTracks: true }
    }), {})

    callObject.setSubscribeToTracksAutomatically(false);
    callObject.updateParticipants(tracksList);
  }, [callObject, localParticipant, participants]);

  const handleEndBreakoutRooms = useCallback(() => {
    if (!callObject) return;

    setIsSessionActive(false);
    setCustomCapsule();
    callObject.setSubscribeToTracksAutomatically(true);
  }, [callObject, setCustomCapsule]);

  const handleAppMessage = useCallback((e) => {
    console.log('handleAppMessage', e);
    if (e?.data?.message?.type === 'breakout-rooms') handleUserTrackSubscriptions();
    if (e?.data?.message?.type === 'end-breakout-rooms') handleEndBreakoutRooms();
    if (e?.data?.message?.type === 'breakout-alert') console.log('alright, mate?');
    if (e?.data?.message?.type === 'broadcast') console.log('BROADCASTING STUFF!!!');
  }, [handleEndBreakoutRooms, handleUserTrackSubscriptions]);

  useEffect(() => {
    if (!callObject) return;

    callObject.on('app-message', handleAppMessage);
    return () => {
      callObject.off('app-message', handleAppMessage);
    }
  }, [
    callObject,
    handleAppMessage,
  ]);

  const roomParticipants = useMemo(() => {
    if (!isSessionActive) return participants
    return participants.filter(p => subParticipants.includes(p.user_id));
  }, [isSessionActive, participants, subParticipants]);

  const participantCount = useMemo(() => roomParticipants.length, [roomParticipants]);

  const createSession = async (maxParticipants) => {
    // sending the breakout-rooms event to other users.
    callObject.sendAppMessage({ message: { type: 'breakout-rooms' }}, '*');
    await handleUserTrackSubscriptions();
  };

  const endSession = async () => {
    setIsSessionActive(false);

    const { data: room } = await getBreakoutRoom(roomInfo?.name);
    if (room.is_active) {
      await endBreakoutRoom(room.id);
      callObject.sendAppMessage({ message: { type: 'end-breakout-rooms' }}, '*');
      handleEndBreakoutRooms();
    }
  };

  const sendBreakoutAlert = async () => {
    const breakoutRoomMates = subParticipants.filter(p => p !== localParticipant.user_id);
    breakoutRoomMates.forEach(mate => {
      callObject.sendAppMessage({ message: { type: 'breakout-alert' }}, mate);
    })
  };

  const broadcastMessage = async () => {
    const guests = participants.filter(p => !p.isOwner);
    const guestsIds = guests.map(g => g.user_id)
    guestsIds.forEach((guestId) => {
      callObject.sendAppMessage({ message: { type: 'broadcast' }}, guestId);
    })
  };

  return (
    <BreakoutRoomContext.Provider
      value={{
        isActive: isSessionActive,
        breakoutRooms,
        participants: roomParticipants,
        participantCount,
        createSession,
        endSession,
        sendBreakoutAlert,
        broadcastMessage,
      }}
    >
      {children}
    </BreakoutRoomContext.Provider>
  );
};

BreakoutRoomProvider.propTypes = {
  children: PropTypes.node,
};

export const useBreakoutRoom = () => useContext(BreakoutRoomContext);