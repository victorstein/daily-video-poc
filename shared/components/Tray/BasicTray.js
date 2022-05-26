import React, { useState, useEffect } from 'react';
import { NETWORK_ASIDE } from '@custom/shared/components/Aside/NetworkAside';
import { PEOPLE_ASIDE } from '@custom/shared/components/Aside/PeopleAside';
import Button from '@custom/shared/components/Button';
import { DEVICE_MODAL } from '@custom/shared/components/DeviceSelectModal';
import { useCallState } from '@custom/shared/contexts/CallProvider';
import { useMediaDevices } from '@custom/shared/contexts/MediaDeviceProvider';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { useResponsive } from '@custom/shared/hooks/useResponsive';
import { ReactComponent as IconCameraOff } from '../../icons/camera-off-md.svg';
import { ReactComponent as IconCameraOn } from '../../icons/camera-on-md.svg';
import { ReactComponent as IconLeave } from '../../icons/leave-md.svg';
import { ReactComponent as IconMicOff } from '../../icons/mic-off-md.svg';
import { ReactComponent as IconMicOn } from '../../icons/mic-on-md.svg';
import { ReactComponent as IconMore } from '../../icons/more-md.svg';
import { ReactComponent as IconNetwork } from '../../icons/network-md.svg';
import { ReactComponent as IconPeople } from '../../icons/people-md.svg';
import { ReactComponent as IconSettings } from '../../icons/settings-md.svg';
import { Tray, TrayButton } from './Tray';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { useBackgroundMusic } from '@custom/shared/hooks/useBackgroundMusic';
import { BgMusicPlayer } from './BgMusicPlayer';

const tracks = [
  {
    name: "E.R.F",
    src: "assets/erf.mp3"
  },
  {
    name: "Relax",
    src: "assets/bg_music.mp3"
  },
  {
    name: "Love",
    src: "assets/love.mp3"
  },
  {
    name: "Piano Moment",
    src: "assets/piano.mp3"
  },
  {
    name: "Dreams",
    src: "assets/dreams.mp3"
  },
]

export const BasicTray = () => {
  const [bgMusicComponent, setBgMusicComponent] = useState(null)
  const responsive = useResponsive();
  const [showMore, setShowMore] = useState(false);
  const { callObject, leave } = useCallState();
  const { customTrayComponent, openModal, toggleAside } = useUIState();
  const { isCamMuted, currentDevices: { mic } } = useMediaDevices();
  const [isMicMuted, setIsMicMuted] = useState(false)
  const { mixedAudioTracks, micGain } = useBackgroundMusic(bgMusicComponent, mic)

  const { isOwner } = useParticipants();

  const toggleCamera = (newState) => {
    if (!callObject) return false;
    return callObject.setLocalVideo(newState);
  };

  const toggleMic = (newState) => {
    setIsMicMuted(!newState)
    if (micGain) {
      return micGain.gain.value = Number(newState)
    }
    
    if (!callObject) return false;
    return callObject.setLocalAudio(newState);
  };

  useEffect(() => {
    const mixAudioTracks = async () => {
      await callObject.setInputDevicesAsync({
        audioSource: mixedAudioTracks,
      });
    }

    if (mixedAudioTracks) {
      mixAudioTracks()
    }
  }, [mixedAudioTracks])

  return (
    <>
      {
        isOwner &&
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BgMusicPlayer
              tracks={tracks}
              getRef={setBgMusicComponent}
            />
          </div>
      }
      <Tray className="tray">
        <TrayButton
          label="Camera"
          onClick={() => toggleCamera(isCamMuted)}
          orange={isCamMuted}
        >
          {isCamMuted ? <IconCameraOff /> : <IconCameraOn />}
        </TrayButton>
        <TrayButton
          label="Mic"
          onClick={() => toggleMic(isMicMuted)}
          orange={isMicMuted}
        >
          {isMicMuted ? <IconMicOff /> : <IconMicOn />}
        </TrayButton>
        {responsive.isMobile() && showMore && (
          <div className="more-options">
            <Button
              className="translucent"
              onClick={() => openModal(DEVICE_MODAL)}
              IconBefore={IconSettings}
            >
              Settings
            </Button>
            <Button
              className="translucent"
              onClick={() => toggleAside(NETWORK_ASIDE)}
              IconBefore={IconNetwork}
            >
              Network
            </Button>
            <Button
              className="translucent"
              onClick={() => toggleAside(PEOPLE_ASIDE)}
              IconBefore={IconPeople}
            >
              People
            </Button>
          </div>
        )}
        {!responsive.isMobile() ? (
          <>
            <TrayButton label="Settings" onClick={() => openModal(DEVICE_MODAL)}>
              <IconSettings />
            </TrayButton>
            <TrayButton label="Network" onClick={() => toggleAside(NETWORK_ASIDE)}>
              <IconNetwork />
            </TrayButton>
            <TrayButton label="People" onClick={() => toggleAside(PEOPLE_ASIDE)}>
              <IconPeople />
            </TrayButton>
          </>
        ) : (
          <TrayButton label="More" onClick={() => setShowMore(!showMore)}>
            <IconMore />
          </TrayButton>
        )}

        {customTrayComponent}

        <span className="divider" />

        <TrayButton label="Leave" onClick={() => leave()} orange>
          <IconLeave />
        </TrayButton>
        <style jsx>{`
          .tray { position: relative };
          .more-options {
            background: var(--background);
            position: absolute;
            transform: translateX(calc(-50% + 26px));
            bottom: calc(15% + var(--spacing-xxxs));
            z-index: 99;
            padding: var(--spacing-xxxs);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-depth-2);
          }
        `}
        </style>
      </Tray>
    </>
  );
};
export default BasicTray;
