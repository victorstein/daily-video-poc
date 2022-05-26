import React, {
  createContext,
  useContext,
  useEffect, useMemo,
  useState
} from 'react';
import { useCallState } from '@custom/shared/contexts/CallProvider';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import PropTypes from 'prop-types';
import toast from 'react-simple-toasts';
import { sleep } from 'utils/sleep';

export const BreakoutRoomContext = createContext();

const buildMessage = (input) => {
  return { message: input };
}

export const BreakoutRoomProvider = ({ children }) => {
  const { callObject } = useCallState();
  const { participants, localParticipant } = useParticipants();
  const { setCustomCapsule } = useUIState();

  const [ isSessionActive, setIsSessionActive ] = useState(false);
  const [ subParticipants, setSubParticipants ] = useState([]);
  const [ breakoutRooms ] = useState({});
  const [ breakoutRoomByUser, setBreakoutRoomByUser ] = useState({});
  const [ breakoutRoomsMap, setBreakoutRoomsMap ] = useState({});
  const [ unassignedUsersIds, setUnassignedUsersIds ] = useState([]);

  const roomParticipants = useMemo(() => {
    if (!isSessionActive) return participants
    return participants.filter(p => subParticipants.includes(p.user_id));
  }, [isSessionActive, participants, subParticipants]);

  const participantCount = useMemo(() => roomParticipants.length, [roomParticipants]);

  const createBreakoutRooms = async (input) => {
    // just faking an async action
    await sleep(2000)

    const messageInput = {
      type: 'create-breakout-rooms',
      payload: input,
    }

    callObject.sendAppMessage(buildMessage(messageInput), '*');

    // this is necessary because the user publishing the message also needs to handle it
    handleCreateBreakoutRooms(messageInput);
  }

  const handleCreateBreakoutRooms = async (message) => {
    console.info('handleCreateBreakoutRooms', message);

    setIsSessionActive(true);

    const { payload } = message;
    const { breakoutRoomByUser, breakoutRoomsMap, unassignedUsersIds } = payload;
    const { user_id: userId } = localParticipant;
    const assignedBreakoutRoom = breakoutRoomByUser[userId];
    const userIsUnassigned = unassignedUsersIds.includes(userId);
    const roomMatesIds = userIsUnassigned ? unassignedUsersIds : Object.keys(breakoutRoomsMap[assignedBreakoutRoom] || {});
    const tracksList = roomMatesIds.reduce((acc, userId) => ({
      ...acc,
      [userId]: { setSubscribedTracks: true }
    }), {})

    setSubParticipants(roomMatesIds);
    setBreakoutRoomByUser(() => breakoutRoomByUser)
    setBreakoutRoomsMap(() => breakoutRoomsMap)
    setUnassignedUsersIds(() => unassignedUsersIds)

    callObject.setSubscribeToTracksAutomatically(false);
    callObject.updateParticipants(tracksList);

    setCustomCapsule()
  }

  const sendBreakoutMessage = async () => {
    const breakoutRoomMates = subParticipants.filter(p => p !== localParticipant.user_id);
    breakoutRoomMates.forEach(mate => {
      callObject.sendAppMessage(buildMessage({ type: 'breakout-message' }), mate);
    })

    handleBreakoutMessage();
  };
  
  const handleBreakoutMessage = async (e) => {
    console.log('handleBreakoutMessage', e);
  }

  const broadcastMessage = async () => {
    const guests = participants.filter(p => !p.isOwner);
    const guestsIds = guests.map(g => g.user_id)
    guestsIds.forEach((guestId) => {
      callObject.sendAppMessage(buildMessage({ type: 'broadcast' }), guestId);
    })
  };

  const handleBroadcast = async (e) => {
    console.log('handleBroadcast', e);

    toast('Broadcast message sent', 10000);
  }

  const endBreakoutRooms = async () => {
    callObject.sendAppMessage(buildMessage({ type: 'end-breakout-rooms' }), '*');
    handleEndBreakoutRooms();
  };

  const handleEndBreakoutRooms = (message) => {
    console.info('handleEndBreakoutRooms', message);

    setIsSessionActive(false);
    setCustomCapsule();
    callObject.setSubscribeToTracksAutomatically(true);
  };

  // map app messages to appropriate handlers
  const handleAppMessage = async (e) => {
    console.info('handleAppMessage', e);

    const handlers = {
      'create-breakout-rooms': handleCreateBreakoutRooms,
      'breakout-message': handleBreakoutMessage,
      'broadcast': handleBroadcast,
      'end-breakout-rooms': handleEndBreakoutRooms,
    }

    const eventType = e.data.message.type;
    const handler = handlers[eventType];
    if (!handler) {
      console.warn(`No handler for ${eventType}`);
      return;
    }

    await handler(e.data.message)
  };

  // subscribe to events on the call object
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

  return (
    <BreakoutRoomContext.Provider
      value={{
        isActive: isSessionActive,
        breakoutRooms,
        participants: roomParticipants,
        participantCount,
        breakoutRoomByUser,
        breakoutRoomsMap,
        unassignedUsersIds,
        endBreakoutRooms,
        sendBreakoutMessage,
        broadcastMessage,
        createBreakoutRooms,
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