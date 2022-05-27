import React, { useState } from 'react';
import Button from '@custom/shared/components/Button';
import { CardBody } from '@custom/shared/components/Card';
import Field from '@custom/shared/components/Field';
import { TextInput } from '@custom/shared/components/Input';
import Modal from '@custom/shared/components/Modal';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { useBreakoutRoom } from './BreakoutRoomProvider';

export const BROADCAST_MODAL = 'broadcast';

export const BroadcastModal = () => {
  const { currentModals, closeModal } = useUIState();
  const [ message, setMessage ] = useState('');
  const { broadcastMessage } = useBreakoutRoom();

  const closeBroadcastModal = () => closeModal(BROADCAST_MODAL)

  const sendMessage = async () => {
    await broadcastMessage(message);
    setMessage('')
    closeBroadcastModal();
  }

  return (
    <Modal
      title="Broadcast Message"
      isOpen={currentModals[BROADCAST_MODAL]}
      onClose={closeBroadcastModal}
      actions={[
        <Button key="close" fullWidth variant="outline">
          Close
        </Button>,
        <Button
          key="submit"
          fullWidth
          onClick={sendMessage}
          disabled={!message}
        >
          Send
        </Button>
      ]}
    >
      <CardBody>
        <Field label="message">
          <TextInput
            placeholder="..."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>
      </CardBody>
    </Modal>
  );
};

export default BroadcastModal;
