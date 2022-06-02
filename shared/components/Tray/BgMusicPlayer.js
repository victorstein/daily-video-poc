import { useState, forwardRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export const BgMusicPlayer = forwardRef(({ tracks }, ref) => {
  const [trackIndex, setTrackIndex] = useState(0);

  const handleClickPrevious = () => {
    setTrackIndex((currentTrack) => Number(currentTrack > 1 && currentTrack - 1));
  };
  
  const handleClickNext = () => {
    setTrackIndex((currentTrack) => Number(currentTrack < tracks.length - 1 && currentTrack + 1));
  };

  return (
    <AudioPlayer
      ref={ref}
      src={tracks[trackIndex].src}
      style={{ maxWidth: '70%', color: 'black' }}
      showSkipControls={true}
      showJumpControls={false}
      header={`${tracks[trackIndex].name}`}
      onClickPrevious={handleClickPrevious}
      onClickNext={handleClickNext}
      onEnded={handleClickNext}
    />
  )
})