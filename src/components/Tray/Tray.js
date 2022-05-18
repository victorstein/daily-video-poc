import React, { useCallback, useState } from 'react';
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
  Info,
  PlayMusic,
  StopMusic,
} from './Icons';


export default function Tray({ leaveCall }) {
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();

  const [showMeetingInformation, setShowMeetingInformation] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const localParticipant = useLocalParticipant();
  const localVideo = useVideoTrack(localParticipant?.session_id);
  const localAudio = useAudioTrack(localParticipant?.session_id);
  const mutedVideo = localVideo.isOff;
  const mutedAudio = localAudio.isOff;

  const addAudioTrack = useCallback(async (e) => {
    // Create audio context
    const audioContext = new AudioContext();

    // Get the microphone input
    const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const microphone = audioContext.createMediaStreamSource(microphoneStream)

    // Get the background music
    const audioElement = document.querySelector('#song');
    const bgMusic = audioContext.createMediaElementSource(audioElement);

    // Mix the tracks
    const mixedOutput = audioContext.createMediaStreamDestination();
    microphone.connect(mixedOutput)
    bgMusic.connect(mixedOutput)

    const mixedAudioTracks = mixedOutput.stream.getAudioTracks()[0]

    audioElement.play()
    await callObject.setInputDevicesAsync({
      audioSource: mixedAudioTracks
    })
  }, [callObject, musicPlaying])

  const toggleVideo = useCallback(() => {
    callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    callObject.setLocalAudio(mutedAudio);
  }, [callObject, mutedAudio]);

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
      <audio id="song" src="bg_music.mp3"></audio>
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
          <button onClick={addAudioTrack}>
            {musicPlaying ? <StopMusic /> : <PlayMusic />}
            {musicPlaying ? 'Stop music' : 'Play music'}
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
