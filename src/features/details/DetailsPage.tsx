import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { CameraCapture } from './CameraCapture'
import { SignatureCanvas } from './SignatureCanvas'
import { mergeImageAndSignature } from './mergeImage'

export const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()
  const [photo, setPhoto] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [merged, setMerged] = useState<string | null>(null)
  const [isMerging, setIsMerging] = useState(false)
  const [error, setError] = useState('')

  const canMerge = Boolean(photo && signature)

  const signatureSize = useMemo(() => {
    return { width: 520, height: 320 }
  }, [])

  const handleMerge = async () => {
    if (!photo || !signature) return
    setIsMerging(true)
    setError('')
    try {
      const mergedDataUrl = await mergeImageAndSignature(photo, signature)
      setMerged(mergedDataUrl)
      localStorage.setItem('audit_image', mergedDataUrl)
    } catch (err) {
      setError('Failed to merge photo and signature.')
    } finally {
      setIsMerging(false)
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <strong>Employee Details</strong>
          <span className="muted">ID: {id}</span>
        </div>
        <nav className="nav">
          <Link to="/list">List</Link>
          <Link to="/analytics">Analytics</Link>
          <button className="ghost" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <section className="card">
        <h2>Identity verification</h2>
        <p className="muted">Capture a photo, add your signature, then merge.</p>

        <div className="details-grid">
          <div className="panel">
            <h3>Camera</h3>
            <CameraCapture onCapture={(dataUrl) => setPhoto(dataUrl)} />
          </div>

          <div className="panel">
            <h3>Signature</h3>
            <SignatureCanvas
              width={signatureSize.width}
              height={signatureSize.height}
              onChange={(dataUrl) => setSignature(dataUrl)}
            />
          </div>
        </div>

        <div className="merge-actions">
          <button
            className="primary"
            type="button"
            onClick={handleMerge}
            disabled={!canMerge || isMerging}
          >
            {isMerging ? 'Merging...' : 'Merge photo + signature'}
          </button>
          {error && <div className="error">{error}</div>}
        </div>

        <div className="panel">
          <h3>Audit image</h3>
          {merged ? (
            <img src={merged} alt="Merged audit" className="audit-image" />
          ) : (
            <div className="placeholder">Merged image preview will appear here.</div>
          )}
        </div>
      </section>
    </div>
  )
}
