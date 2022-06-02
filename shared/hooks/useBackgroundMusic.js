import { useState, useEffect } from "react";

export const useBackgroundMusic = (musicSource, micSource) => {
  const ctx = window.AudioContext || window.webkitAudioContext;
  const [audioContext] = useState(new ctx())
  const [bgMusic, setBgMusic] = useState(null)
  const [microphone, setMic] = useState(null)
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

  const mixTracks = (micGain) => {
    const mixedOutput = audioContext.createMediaStreamDestination();
    
    // Get individual control of the microphone
    microphone.connect(micGain)
    micGain.connect(mixedOutput)

    bgMusic.connect(mixedOutput)

    const mixedAudioTracks = mixedOutput.stream.getAudioTracks()[0]
    return mixedAudioTracks
  }

  useEffect(() => {
    if (microphone && bgMusic) {
      const micGain = audioContext.createGain()
      const mixedAudioTracks = mixTracks(micGain)

      setState({ mixedAudioTracks, micGain })
    }
  }, [microphone, bgMusic])
  
  useEffect(() => {
    const startMic = async () => {
      const microphone = await getMicrophone()
      setMic(microphone)
    }
    startMic()
  }, [micSource])

  useEffect(() => {
    if (musicSource && !bgMusic) {
      setBgMusic(getBackgroundMusic())
    }
  }, [musicSource])

  return state
}