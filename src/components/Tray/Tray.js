import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  useDaily,
  useScreenShare,
  useLocalParticipant,
  useVideoTrack,
  useAudioTrack,
} from '@daily-co/daily-react-hooks';
import MeetingInformation from '../MeetingInformation/MeetingInformation';
import './Tray.css';
import {
  CameraOn,
  Leave,
  CameraOff,
  MicrophoneOff,
  MicrophoneOn,
  Screenshare,
  Info
} from './Icons';
import { useAudioContext } from '../../customHooks/useAudioContext';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function Tray({ leaveCall }) {
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();
  const audioPlayer = useRef(null)
  const { mixedAudioTracks, micGain } = useAudioContext({ musicSource: audioPlayer })
  console.log("MIC GAIN", micGain)

  const [showMeetingInformation, setShowMeetingInformation] = useState(false);
  const [mutedAudio, setMutedAudio] = useState(false)

  const localParticipant = useLocalParticipant();
  const localVideo = useVideoTrack(localParticipant?.session_id);
  const mutedVideo = localVideo.isOff;

  useEffect(() => {
    const addTracksToStream = async () => {
      await callObject.setInputDevicesAsync({
        audioSource: mixedAudioTracks
      })
    }

    if (mixedAudioTracks) {
      addTracksToStream()
    }
  }, [mixedAudioTracks, callObject])

  const toggleVideo = useCallback(() => {
    callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    micGain.gain.value = mutedAudio ? 1 : 0
    setMutedAudio(!mutedAudio)
  }, [mutedAudio, micGain]);

  const toggleScreenShare = () =>
    isSharingScreen ? stopScreenShare() : startScreenShare();

  const leave = () => {
    leaveCall();
  };

  const toggleMeetingInformation = () => {
    showMeetingInformation
      ? setShowMeetingInformation(false)
      : setShowMeetingInformation(true);
  };

  return (
    <div className="tray">
      {showMeetingInformation && <MeetingInformation />}
      {
        callObject.participants().local.user_name === 'meeting host'
          ? <AudioPlayer
              src="bg_music.mp3"
              ref={audioPlayer}
            />
          : null
      }
      <div className="tray-buttons-container">
        <div className="controls">
          <button onClick={toggleVideo}>
            {mutedVideo ? <CameraOff /> : <CameraOn />}
            {mutedVideo ? 'Turn camera on' : 'Turn camera off'}
          </button>
          <button onClick={toggleAudio}>
            {mutedAudio ? <MicrophoneOff /> : <MicrophoneOn />}
            {mutedAudio ? 'Unmute mic' : 'Mute mic'}
          </button>
        </div>
        <div className="actions">
          <button onClick={toggleScreenShare}>
            <Screenshare />
            {isSharingScreen ? 'Stop sharing screen' : 'Share screen'}
          </button>
          <button onClick={toggleMeetingInformation}>
            <Info />
            {showMeetingInformation ? 'Hide info' : 'Show info'}
          </button>
        </div>
        <div className="leave">
          <button onClick={leave}>
            <Leave /> Leave call
          </button>
        </div>
      </div>
    </div>
  );
}
