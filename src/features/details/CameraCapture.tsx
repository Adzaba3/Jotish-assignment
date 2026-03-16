import React, { useEffect, useRef, useState } from 'react'

type CameraCaptureProps = {
  onCapture: (dataUrl: string) => void
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const start = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: true })
        if (!isMounted) return
        streamRef.current = media
        if (videoRef.current) {
          videoRef.current.srcObject = media
        }
      } catch (err) {
        setError('Camera access denied or unavailable.')
      }
    }

    start()

    return () => {
      isMounted = false
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    onCapture(canvas.toDataURL('image/png'))
  }

  return (
    <div className="camera">
      <div className="camera-frame">
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted />
        )}
      </div>
      <button className="primary" onClick={capture} type="button">
        Capture photo
      </button>
    </div>
  )
}
