import { useEffect, useState, useCallback } from "react";

export const useBackgroundMusic = (musicSource, micSource) => {
  const [bgMusic, setBgMusic] = useState()
  const [state, setState] = useState({})

  const getMicrophone = async (context) => {
    const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: { micSource } })
    const microphone = context.createMediaStreamSource(microphoneStream)
    return microphone
  }

  const getBackgroundMusic = (context) => {
    const bgMusic = context.createMediaElementSource(musicSource)
    bgMusic.connect(context.destination)
    return bgMusic
  }

  const mixTracks = (context, microphone, bgMusic, micGain) => {
    const mixedOutput = context.createMediaStreamDestination();
    
    // Get individaul control of the microphone
    microphone.connect(micGain)
    micGain.connect(mixedOutput)

    // Add background music if needed
    if (bgMusic) { bgMusic.connect(mixedOutput) }

    const mixedAudioTracks = mixedOutput.stream.getAudioTracks()[0]
    return mixedAudioTracks
  }

  const init = useCallback(async () => {
    const ctx = window.AudioContext || window.webkitAudioContext;
    const audioContext = state.audioContext || new ctx()
    const microphone = await getMicrophone(audioContext)
    const backgroundMusic = bgMusic || getBackgroundMusic(audioContext)
    const micGain = audioContext.createGain(audioContext)
    const mixedAudioTracks = mixTracks(audioContext, microphone, bgMusic, micGain)

    setBgMusic(backgroundMusic)
    setState({ audioContext, microphone, mixedAudioTracks, micGain })
  }, [musicSource, micSource, bgMusic])

  useEffect(() => {
    if (musicSource && micSource) {
      init()
    }
  }, [musicSource, micSource])

  return state
}