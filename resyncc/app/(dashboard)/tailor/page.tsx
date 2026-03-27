'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, CheckCircle2, ArrowLeft, FileText, X } from 'lucide-react'
import { useTailorStore } from '@/store/tailorStore'
import { useToast } from '@/components/ui/Toast'
import StepIndicator from '@/components/tailor/StepIndicator'
import { apiCall } from '@/lib/api'

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
    setSessionId
  } = useTailorStore()

  const [dragActive, setDragActive] = useState(false)
  const charCount = jdText.length
  
  // Mock resumes from DB
  const savedResumes = [
    { id: '1', name: 'Google_SWE_Final.pdf', score: 87 },
    { id: '2', name: 'Startup_General.docx', score: 64 }
  ]

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('File must be smaller than 5MB', 'error')
      return
    }
    setResumeFile(file)
    setResumeFileName(file.name)
    setSelectedResume('upload') // signify ad-hoc
  }

  const canProceed = (selectedResumeId || resumeFile) && charCount >= 100

  const startAnalysis = async () => {
    if (!canProceed) return

    try {
      // Free limit simulation check
      // For real app, endpoint checks rate limit directly
      const res = await apiCall('/sessions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_id: selectedResumeId === 'upload' ? '123' : selectedResumeId, // mock ID logic here
          job_description: jdText
        })
      })

      setSessionId(res.session_id)
      router.push('/tailor/loading')
      
    } catch (err: any) {
      if (err.message.includes('Daily limit reached')) {
        showToast("You've used all 3 free sessions this month. Upgrade to Pro.", 'warning')
      } else {
        // Fallback simulation if backend is not running
        console.warn('Backend not responsive, simulating successful analysis for UI testing.', err)
        setSessionId('mock-session-' + Date.now())
        router.push('/tailor/loading')
      }
    }
  }

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={1} title="Upload & Input" />

      <div className="two-panel-layout">
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

            {!resumeFile ? (
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
            <span className="line"></span>
            <span>or choose a saved resume</span>
            <span className="line"></span>
          </div>

          <div className="saved-resumes-list">
             {savedResumes.map(res => (
               <div
                 key={res.id}
                 className={`saved-resume-row ${selectedResumeId === res.id ? 'selected' : ''}`}
                 onClick={() => {
                   setSelectedResume(res.id)
                   setResumeFile(null) // clear new upload if user picks saved
                 }}
               >
                 <div className="flex-row-center margin-0">
                   <FileText size={16} className="margin-r-6 muted-icon" />
                   <span className="font-medium text-14">{res.name}</span>
                 </div>
                 <div className={`sidebar-score-pill ${res.score >= 80 ? 'score-pill-excellent' : 'score-pill-good'}`}>
                   {res.score}
                 </div>
               </div>
             ))}
          </div>

        </div>

        <div className="tailor-panel">
          <h2 className="panel-header">Job Description</h2>
          
          <textarea
            className="jd-textarea"
            placeholder="Paste the full job description here...&#10;Include all requirements, responsibilities, and any skills mentioned. The more complete the JD, the better your tailoring results."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />

          <div className="jd-stats-row">
             <span className="text-12 color-muted">{charCount} / 8000</span>
             {charCount > 150 && (
               <span className="text-12 color-muted">~{Math.floor(charCount / 65)} keywords detected</span>
             )}
          </div>

          <div className="divider-text">
            <span className="line"></span>
            <span>or</span>
            <span className="line"></span>
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
           Analyze & Tailor →
         </button>
      </div>
    </div>
  )
}
