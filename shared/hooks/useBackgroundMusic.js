import { useEffect, useState, useCallback } from "react";

export const useBackgroundMusic = (musicSource, micSource) => {
  const ctx = window.AudioContext || window.webkitAudioContext;
  const [audioContext] = useState(new ctx())
  const [state, setState] = useState({})

  const getMicrophone = async () => {
    const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: { micSource } })
    const microphone = audioContext.createMediaStreamSource(microphoneStream)
    return microphone
  }

  const getBackgroundMusic = () => {
    const bgMusic = audioContext.createMediaElementSource(musicSource)
    bgMusic.connect(audioContext.destination)
    return bgMusic
  }

  const mixTracks = (microphone, bgMusic, micGain) => {
    const mixedOutput = audioContext.createMediaStreamDestination();
    
    // Get individaul control of the microphone
    microphone.connect(micGain)
    micGain.connect(mixedOutput)

    // Add background music if needed
    if (bgMusic) { bgMusic.connect(mixedOutput) }

    const mixedAudioTracks = mixedOutput.stream.getAudioTracks()[0]
    return mixedAudioTracks
  }

  const init = useCallback(async () => {
    const microphone = await getMicrophone()
    const bgMusic = state.bgMusic || getBackgroundMusic()
    const micGain = audioContext.createGain()
    const mixedAudioTracks = mixTracks(microphone, bgMusic, micGain)

    setState({ audioContext, microphone, bgMusic, mixedAudioTracks, micGain })
  }, [musicSource, micSource, state])

  useEffect(() => {
    if (musicSource && micSource) {
      init()
    }
  }, [musicSource, micSource])

  return state
}