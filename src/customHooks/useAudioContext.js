import { useEffect, useState, useCallback } from "react";

export const useAudioContext = ({ musicSource }) => {
  const [state, setState] = useState({
    audioContext: null,
    bgMusic: null,
    microphone: null,
    mixedAudioTracks: null
  })

  const getMicrophone = async (audioContext) => {
    const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const microphone = audioContext.createMediaStreamSource(microphoneStream)

    return microphone
  }

  const getBackgroundMusic = useCallback(async (audioContext) => {
    const element = musicSource.current.audio.current
    const bgMusic = audioContext.createMediaElementSource(element)
    // Connect to local destination
    bgMusic.connect(audioContext.destination)
    return bgMusic
  }, [musicSource])

  const mixTracks = async (audioContext, microphone, bgMusic) => {
    const mixedOutput = audioContext.createMediaStreamDestination();
    microphone.connect(mixedOutput)
    bgMusic.connect(mixedOutput)
    const mixedAudioTracks = mixedOutput.stream.getAudioTracks()[0]

    return mixedAudioTracks
  }

  useEffect(() => {
    const init = async () => {
      if (state.audioContext === null) {
        const audioContext = new AudioContext()
  
        const microphone = await getMicrophone(audioContext)
        const bgMusic = await getBackgroundMusic(audioContext)
        const mixedAudioTracks = await mixTracks(audioContext, microphone, bgMusic)
  
        setState({ audioContext, microphone, bgMusic, mixedAudioTracks })
      }
    }

    init()
  }, [state.audioContext, getBackgroundMusic])

  return state
}