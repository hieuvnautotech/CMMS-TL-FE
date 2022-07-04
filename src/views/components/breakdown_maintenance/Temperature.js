import React, { useState } from 'react'
import useEyeDropper from 'use-eye-dropper'
import chroma from "chroma-js";

export default function Temperature(){
  const { open, close, isSupported } = useEyeDropper()
  const [color, setColor] = useState('#fff')
  const [error, setError] = useState()
  const [kelvin, setKelvin] = useState()
  const pickColor = () => {
    open()
      .then(color => {
        setColor(color.sRGBHex);
        setKelvin(chroma(color.sRGBHex).temperature());
      })
      .catch(e => {
        console.log(e)
        if (!e.canceled) setError(e)
      })
  }
  return (
    <>
      <div style={{ padding: '64px', background: color }}>{`~${kelvin}K`}</div>
      {isSupported() ?
          <button onClick={pickColor}>Pick color</button>
        : <span>EyeDropper API not supported in this browser</span>
      }
      {!!error && <span>{error.message}</span>}
    </>
  )
}