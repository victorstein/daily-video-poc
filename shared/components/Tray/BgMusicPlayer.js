import { useRef, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export const BgMusicPlayer = ({ tracks, getRef }) => {
  const bgMusicComponent = useRef(null);
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    getRef(bgMusicComponent?.current?.audio?.current)
  }, [bgMusicComponent])

  const handleClickPrevious = () => {
    setTrackIndex((currentTrack) => currentTrack > 0 && currentTrack - 1);
  };
  
  const handleClickNext = () => {
    setTrackIndex((currentTrack) => currentTrack < tracks.length - 1 && currentTrack + 1);
  };

  return (
    <AudioPlayer
      ref={bgMusicComponent}
      src={tracks[trackIndex].src}
      style={{ maxWidth: '70%' }}
      showSkipControls={true}
      showJumpControls={false}
      header={`${tracks[trackIndex].name}`}
      onClickPrevious={handleClickPrevious}
      onClickNext={handleClickNext}
      onEnded={handleClickNext}
    />
  )
}