'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, FileText, Loader2, UploadCloud, X } from 'lucide-react'
import { useTailorStore } from '@/store/tailorStore'
import { useToast } from '@/components/ui/Toast'
import StepIndicator from '@/components/tailor/StepIndicator'
import { apiCall, apiUpload } from '@/lib/api'
import type { Resume } from '@/types'

export default function TailorStepOnePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const {
    resumeFile,
    resumeFileName,
    selectedResumeId,
    jdText,
    setResumeFile,
    setResumeFileName,
    setSelectedResume,
    setJdText,
    setSessionId,
  } = useTailorStore()

  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedResumes, setSavedResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)

  const charCount = jdText.length

  // Load user's existing resumes from backend
  useEffect(() => {
    apiCall('/upload/resumes')
      .then((data) => {
        setSavedResumes(
          data.resumes.map((r: any) => ({
            id: r.resume_id,
            name: r.name,
            base_ats_score: r.base_ats_score,
            created_at: r.created_at,
          }))
        )
      })
      .catch(() => setSavedResumes([]))
      .finally(() => setLoadingResumes(false))
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('File must be smaller than 5MB', 'error')
      return
    }
    const ext = file.name.toLowerCase()
    if (!ext.endsWith('.pdf') && !ext.endsWith('.docx')) {
      showToast('Only PDF and DOCX files are accepted', 'error')
      return
    }
    setResumeFile(file)
    setResumeFileName(file.name)
    setSelectedResume(null) // clear saved resume selection
  }

  /** Upload new file to backend, get back a resume_id */
  const uploadFileToBackend = async (): Promise<string> => {
    if (!resumeFile) throw new Error('No file selected')

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', resumeFile)
    formData.append('name', resumeFileName || resumeFile.name)

    try {
      const data = await apiUpload('/upload/resume', formData)
      showToast(`Resume uploaded — ${data.char_count.toLocaleString()} characters extracted`, 'success')
      // Refresh saved resumes list
      setSelectedResume(data.resume_id)
      setSavedResumes((prev) => [
        { id: data.resume_id, name: data.name, base_ats_score: 0, created_at: new Date().toISOString(), user_id: '', file_url: '', parsed_json: {}, raw_text: '' },
        ...prev,
      ])
      return data.resume_id
    } finally {
      setIsUploading(false)
    }
  }

  const canProceed =
    (selectedResumeId || resumeFile) && charCount >= 100 && !isUploading && !isSubmitting

  const startAnalysis = async () => {
    if (!canProceed) return
    setIsSubmitting(true)

    try {
      let resumeId = selectedResumeId

      // If user dropped a new file, upload it first
      if (resumeFile && !selectedResumeId) {
        resumeId = await uploadFileToBackend()
      }

      if (!resumeId) {
        showToast('Please select or upload a resume first', 'error')
        return
      }

      const res = await apiCall('/sessions/analyze', {
        method: 'POST',
        body: JSON.stringify({
          resume_id: resumeId,
          job_description: jdText,
        }),
      })

      setSessionId(res.session_id)
      router.push('/tailor/loading')
    } catch (err: any) {
      if (err.message?.includes('limit reached')) {
        showToast("You've used all 3 free sessions. Upgrade to Pro for unlimited.", 'warning')
      } else {
        showToast(err.message || 'Failed to start analysis', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={1} title="Upload & Input" />

      <div className="two-panel-layout">
        {/* LEFT: Resume */}
        <div className="tailor-panel">
          <h2 className="panel-header">Your Resume</h2>

          <div
            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${resumeFile ? 'file-selected' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !resumeFile && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".pdf,.docx"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />

            {isUploading ? (
              <>
                <Loader2 size={40} className="spinner text-blue-600 mb-3" />
                <p className="upload-zone-sub">Extracting text from resume...</p>
              </>
            ) : !resumeFile ? (
              <>
                <UploadCloud size={56} className="upload-icon-muted" />
                <h3 className="upload-zone-title">Drag & drop your resume</h3>
                <p className="upload-zone-sub">PDF or DOCX · Max 5MB</p>
                <div className="upload-zone-or">or</div>
                <button className="btn-outline-pill-small">Browse Files</button>
              </>
            ) : (
              <>
                <div className="success-circle"><CheckCircle2 size={24} color="var(--green)" /></div>
                <h3 className="upload-zone-title-active">{resumeFileName}</h3>
                <p className="upload-zone-sub">{(resumeFile.size / 1024).toFixed(0)}KB · {resumeFile.type.split('/')[1]}</p>
                <button
                  className="change-file-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setResumeFile(null)
                    setResumeFileName(null)
                    setSelectedResume(null)
                  }}
                >
                  Change File <X size={12} />
                </button>
              </>
            )}
          </div>

          <div className="divider-text">
            <span className="line" />
            <span>or choose a saved resume</span>
            <span className="line" />
          </div>

          <div className="saved-resumes-list">
            {loadingResumes ? (
              <div className="text-13 muted text-center">Loading resumes...</div>
            ) : savedResumes.length === 0 ? (
              <div className="text-13 muted text-center">No saved resumes yet</div>
            ) : (
              savedResumes.map((res) => (
                <div
                  key={res.id}
                  className={`saved-resume-row ${selectedResumeId === res.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedResume(res.id)
                    setResumeFile(null)
                  }}
                >
                  <div className="flex-row-center margin-0">
                    <FileText size={16} className="margin-r-6 muted-icon" />
                    <span className="font-medium text-14">{res.name}</span>
                  </div>
                  {res.base_ats_score > 0 && (
                    <div className={`sidebar-score-pill ${res.base_ats_score >= 80 ? 'score-pill-excellent' : 'score-pill-good'}`}>
                      {res.base_ats_score}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Job Description */}
        <div className="tailor-panel">
          <h2 className="panel-header">Job Description</h2>

          <textarea
            className="jd-textarea"
            placeholder={"Paste the full job description here...\nInclude all requirements, responsibilities, and any skills mentioned. The more complete the JD, the better your tailoring results."}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />

          <div className="jd-stats-row">
            <span className={`text-12 ${charCount < 100 ? 'color-red' : 'color-muted'}`}>
              {charCount} / 8000 {charCount < 100 && `(min 100)`}
            </span>
            {charCount > 150 && (
              <span className="text-12 color-muted">~{Math.floor(charCount / 65)} keywords detected</span>
            )}
          </div>

          <div className="divider-text">
            <span className="line" /><span>or</span><span className="line" />
          </div>

          <input
            className="url-input-disabled"
            placeholder="🔗 Paste job listing URL... (URL parsing coming soon)"
            disabled
          />
        </div>
      </div>

      <div className="sticky-bottom-action-bar">
        <button className="back-btn-text" onClick={() => router.push('/dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <button
          className={`action-btn-primary ${!canProceed ? 'disabled' : ''}`}
          onClick={startAnalysis}
          disabled={!canProceed}
        >
          {isSubmitting ? <><Loader2 size={16} className="spinner" /> Analyzing...</> : 'Analyze & Tailor →'}
        </button>
      </div>
    </div>
  )
}
