import React, { useState, useEffect } from 'react';
import Button from '@custom/shared/components/Button';
import { CardBody } from '@custom/shared/components/Card';
import Field from '@custom/shared/components/Field';
import { NumberInput, BooleanInput } from '@custom/shared/components/Input';
import Modal from '@custom/shared/components/Modal';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { useBreakoutRoom } from './BreakoutRoomProvider';

export const BREAKOUT_ROOM_MODAL = 'breakout-room';

export const BreakoutRoomModal = () => {
  const [ isCreatingRooms, setIsCreatingRooms ] = useState(false)
  const { currentModals, closeModal } = useUIState();
  const { participants } = useParticipants();
  const [ roomsCount, setRoomsCount ] = useState(1);
  const { createBreakoutRooms } = useBreakoutRoom();
  const [ breakoutRoomsInput, setBreakoutRoomInput ] = useState({ 0: {} });
  const [ breakoutRoomByUser, setBreakoutRoomByUser ] = useState({});

  useEffect(() => {
    Array(roomsCount).fill(1).forEach((_, index) => {
      breakoutRoomsInput[index] = breakoutRoomsInput[index] || {}
    })
  }, [roomsCount, breakoutRoomsInput])

  const create = async () => {
    try {
      setIsCreatingRooms(true);
      await createBreakoutRooms({ breakoutRoomsInput, breakoutRoomByUser });
      closeModal(BREAKOUT_ROOM_MODAL);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsCreatingRooms(false);
    }
  };

  const updateBreakoutSelection = (e, roomIndex, participant) => {
    const isParticipantSelected = e.target.checked

    // loop through all rooms and either add or remove participant
    for (const key in breakoutRoomsInput) {
      if (key === roomIndex.toString() && isParticipantSelected) {
        // addParticipantToRoom
        breakoutRoomsInput[key] = breakoutRoomsInput[key] || {}
        breakoutRoomsInput[key][participant.user_id] = isParticipantSelected;
      } else if (breakoutRoomsInput[key]?.[participant.user_id]) {
        // removeParticipantFromRoom
        delete breakoutRoomsInput[key][participant.user_id];
      }
    }

    setBreakoutRoomInput(() => JSON.parse(JSON.stringify(breakoutRoomsInput)));
    setBreakoutRoomByUser(prev => ({
      ...prev,
      [participant.user_id]: isParticipantSelected ? roomIndex : null
    }))
  }

  const renderParticipantOption = (participant, roomIndex) => {
    const isUserInRoom = Boolean(breakoutRoomsInput[roomIndex]?.[participant.user_id])
    return (
      <span key={participant.user_id}>
        <span style={{ display: 'inline-block', marginRight: 5 }}>{participant.name}</span>

        <BooleanInput
          value={isUserInRoom}
          disabled={isCreatingRooms}
          onChange={e => updateBreakoutSelection(e, roomIndex, participant)}
        />
      </span>
    )
  }

  return (
    <Modal
      title="Breakout Rooms"
      isOpen={currentModals[BREAKOUT_ROOM_MODAL]}
      onClose={() => closeModal(BREAKOUT_ROOM_MODAL)}
      actions={[
        <Button key="close" fullWidth variant="outline" disabled={isCreatingRooms}>
          Close
        </Button>,
        <Button
          key="submit"
          fullWidth
          disabled={participants.length < 2 || isCreatingRooms}
          onClick={create}>
          Create rooms
        </Button>
      ]}
    >
      <CardBody>
        { isCreatingRooms ? 'Creating Rooms...' : (<>
          <Field label="How many rooms?">
            <NumberInput
              placeholder="number of rooms"
              required
              value={roomsCount}
              onChange={(e) => setRoomsCount(+e.target.value)}
              min={1}
              max={participants.length}
            />
          </Field>

          {Array(roomsCount).fill(1).map((_, roomIndex) => (
            <Field label={`Participants of Room #${roomIndex +1}`} key={roomIndex}>
              <div style={{
                display: 'flex',
                justifyContent: 'start',
                gap: '15px',
              }}>
                {participants.map((participant) => (
                  renderParticipantOption(participant, roomIndex)
                ))}
              </div>
            </Field>
          ))}
        </>)}
      </CardBody>
    </Modal>
  );
};

export default BreakoutRoomModal;
