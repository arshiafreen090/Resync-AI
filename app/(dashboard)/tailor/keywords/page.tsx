'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Wand2, Edit2, AlertCircle } from 'lucide-react'
import StepIndicator from '@/components/tailor/StepIndicator'
import SectionProgress from '@/components/tailor/SectionProgress'
import { useTailorStore } from '@/store/tailorStore'
import { KeywordDecision } from '@/types'

// MOCK DATA IMPORT / INJECTION
const MOCK_KEYWORDS: KeywordDecision[] = [
  {
    id: 'k1',
    session_id: 'sess_1',
    keyword: 'Product Management',
    match_type: 'contextual',
    user_decision: 'pending',
    original_bullet: null,
    modified_bullet: null,
    added_bullet: null,
    clarifying_question: "Did you manage product roadmaps, coordinate with engineering teams, or make product decisions in any role?",
    placement: "Product Manager — Google",
    section: "experience",
    reasoning: null,
    clarifying_answer: null
  },
  {
    id: 'k2',
    session_id: 'sess_1',
    keyword: 'Machine Learning',
    match_type: 'modification',
    user_decision: 'pending',
    original_bullet: "Developed predictive algorithms to analyze user behavior patterns and improve recommendation systems for e-commerce platform.",
    modified_bullet: "Developed machine learning algorithms to analyze user behavior patterns and improve recommendation systems for e-commerce platform.",
    reasoning: "Original mentions 'predictive algorithms' which directly relates to ML. Making the connection explicit aligns with ATS requirements.",
    placement: "Google SWE Intern",
    section: "experience",
    added_bullet: null,
    clarifying_question: null,
    clarifying_answer: null
  },
  {
    id: 'k3',
    session_id: 'sess_1',
    keyword: 'Data Analysis, SQL',
    match_type: 'addition',
    user_decision: 'pending',
    original_bullet: "Analyzed customer feedback and market trends to identify product improvement opportunities.",
    modified_bullet: "Performed comprehensive data analysis using SQL to analyze customer feedback and market trends, identifying opportunities for product improvements.",
    added_bullet: "Leveraged advanced SQL queries and data analysis techniques to extract insights from large datasets, supporting data-driven decision making across teams.",
    placement: "Flipkart Product Intern",
    section: "experience",
    reasoning: null,
    clarifying_question: null,
    clarifying_answer: null
  },
  {
    id: 'k4',
    session_id: 'sess_1',
    keyword: 'Kubernetes, Docker',
    match_type: 'not_applicable',
    user_decision: 'pending',
    reasoning: "DevOps technologies not mentioned or implied anywhere in resume including work experience, skills, or education.",
    section: "skills",
    original_bullet: null, modified_bullet: null, added_bullet: null,
    placement: null, clarifying_question: null, clarifying_answer: null
  }
]

export default function KeywordReviewPage() {
  const router = useRouter()
  const [localKeywords, setLocalKeywords] = useState<KeywordDecision[]>([])
  const [activeSection, setActiveSection] = useState('experience')
  const [shakingId, setShakingId] = useState<string | null>(null)
  
  const SECTIONS = [
    { id: 'personal', label: 'Personal' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'done', label: 'Done' }
  ]

  useEffect(() => {
    // Inject Mock
    setLocalKeywords(MOCK_KEYWORDS)
  }, [])

  const handleDecision = (id: string, decision: 'accepted' | 'rejected', answer?: string) => {
    if (decision === 'accepted') {
      const kw = localKeywords.find(k => k.id === id)
      if (kw?.match_type === 'contextual' && !answer?.trim()) {
        setShakingId(id)
        setTimeout(() => setShakingId(null), 500)
        return
      }
    }
    
    // Animation state
    const cardEl = document.getElementById(`kw-card-${id}`)
    if (cardEl) {
      cardEl.classList.add(decision === 'accepted' ? 'anim-accept' : 'anim-reject')
      setTimeout(() => {
        setLocalKeywords(prev => prev.map(k => k.id === id ? { ...k, user_decision: decision, clarifying_answer: answer || null } : k))
      }, 300)
    }
  }

  const handleFixAI = (id: string) => {
    const cardEl = document.getElementById(`kw-card-${id}`)
    if (cardEl) {
      cardEl.classList.add('ai-loading')
      setTimeout(() => {
        cardEl.classList.remove('ai-loading')
        // Mock transform to Modification
        setLocalKeywords(prev => prev.map(k => k.id === id ? { 
          ...k, 
          match_type: 'modification', 
          modified_bullet: 'AI has completely rewritten this bullet combining your context with optimal keywords.',
          reasoning: 'Re-written directly by AI assistant using user context.',
        } as KeywordDecision : k))
      }, 1500)
    }
  }

  const handleNextSection = () => {
    const currentIdx = SECTIONS.findIndex(s => s.id === activeSection)
    if (currentIdx < SECTIONS.length - 1) {
      const next = SECTIONS[currentIdx + 1]
      setActiveSection(next.id)
      if (next.id === 'done') {
        router.push('/tailor/editor')
      }
    }
  }

  const sectionKeywords = localKeywords.filter(k => k.section === activeSection && k.user_decision === 'pending')
  const isSectionComplete = sectionKeywords.length === 0 && activeSection !== 'done'
  
  const totalDecided = localKeywords.filter(k => k.user_decision !== 'pending').length
  const progressPercent = localKeywords.length > 0 ? (totalDecided / localKeywords.length) * 100 : 0

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={3} title="Keyword Review" />

      <SectionProgress 
        sections={SECTIONS.map(s => ({
          ...s,
          status: activeSection === s.id ? 'active' : 'upcoming' // simplified state
        }))} 
        currentSection={activeSection} 
        onSectionClick={(id) => setActiveSection(id)}
      />

      <div className="current-section-header">
         <div className="text-14-semi">Currently reviewing: {activeSection.toUpperCase()}</div>
      </div>

      <div className="keyword-cards-container">
        
        {isSectionComplete && (
          <div className="section-complete-banner">
             <CheckCircle2 size={48} color="var(--green)" className="margin-b-16" />
             <h3 className="instrument-title-28 margin-b-24">Section Complete ✓</h3>
             <button className="btn-blue-filled" onClick={handleNextSection}>Continue to Next Section →</button>
          </div>
        )}

        {sectionKeywords.map(kw => {
          
          if (kw.match_type === 'contextual') {
            return (
              <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-contextual">
                <div className="kw-header-row">
                  <div>
                    <div className="kw-label-muted">KEYWORDS PENDING CONFIRMATION</div>
                    <div className="kw-title-flex"><div className="orange-dot-pulse"/> {kw.keyword}</div>
                  </div>
                  <div className="kw-badge orange">◎ CONTEXTUAL MATCH</div>
                </div>
                <div className="kw-placement">PLACEMENT: {kw.placement}</div>
                <hr className="kw-divider"/>
                <div className="kw-box beige">
                  <div className="font-bold-12 ink margin-b-6">Clarifying Question:</div>
                  <div className="text-14 muted">{kw.clarifying_question}</div>
                </div>
                <textarea 
                  className={`kw-textarea ${shakingId === kw.id ? 'shake-anim' : ''}`}
                  placeholder="Please provide details about your experience with these keywords..."
                  onChange={(e) => {
                    // Updating state per char would re-render; using generic uncontrolled ref for MVP
                    kw.clarifying_answer = e.target.value
                  }}
                />
                <div className="kw-action-row">
                  <button className="btn-outline-red" onClick={() => handleDecision(kw.id, 'rejected')}><X size={14}/> Reject</button>
                  <div className="flex-row-center gap-10">
                    <button className="btn-outline-blue" onClick={() => handleFixAI(kw.id)}><Wand2 size={14}/> Fix with AI</button>
                    <button className="btn-blue-filled" onClick={() => handleDecision(kw.id, 'accepted', kw.clarifying_answer || '')}>Yes →</button>
                  </div>
                </div>
                <div className="ai-overlay"><Loader2 className="spinner margin-b-12" size={32} color="var(--blue)" /> AI is generating a suggestion...</div>
              </div>
            )
          }

          if (kw.match_type === 'modification') {
            return (
              <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-modification">
                <div className="kw-header-row">
                  <div>
                    <div className="kw-label-muted">KEYWORDS MODIFIED</div>
                    <div className="kw-title-flex"><div className="blue-dot"/> {kw.keyword}</div>
                  </div>
                  <div className="kw-badge blue">✎ MODIFICATION</div>
                </div>
                <div className="kw-placement">PLACEMENT: {kw.placement}</div>
                
                <div className="kw-box grey margin-b-12">
                  <div className="font-bold-11 uppercase muted margin-b-8">Original Bullet:</div>
                  <div className="text-14 italic muted">{kw.original_bullet}</div>
                </div>

                <div className="kw-box blue-tint margin-b-16">
                  <div className="flex-row-center gap-8 margin-b-8">
                     <CheckCircle2 size={14} color="var(--blue)" />
                     <div className="font-bold-11 uppercase blue-text">Modified Bullet</div>
                  </div>
                  <div className="text-14 ink">{kw.modified_bullet}</div>
                </div>

                <div className="kw-reasoning">
                  <div className="font-bold-10 uppercase muted margin-b-6">REASONING:</div>
                  <div className="text-13 muted">{kw.reasoning}</div>
                </div>

                <div className="kw-action-row">
                  <button className="btn-outline-red" onClick={() => handleDecision(kw.id, 'rejected')}><X size={14}/> Reject</button>
                  <div className="flex-row-center gap-10">
                    <button className="btn-outline-blue"><Edit2 size={14}/> Edit</button>
                    <button className="btn-blue-filled" onClick={() => handleDecision(kw.id, 'accepted')}>✓ Accept Revision</button>
                  </div>
                </div>
              </div>
            )
          }

          if (kw.match_type === 'addition') {
             return (
               <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-addition">
                 <div className="kw-header-row">
                   <div>
                     <div className="kw-label-muted">NEW CONTENT</div>
                     <div className="kw-title-flex"><div className="purple-dot"/> {kw.keyword}</div>
                   </div>
                   <div className="kw-badge purple">+ ADDITION / MODIFICATION</div>
                 </div>
                 
                 <div className="kw-box green-tint margin-b-16">
                   <div className="font-bold-11 uppercase green-text margin-b-8">+ Addition — New Bullet Point:</div>
                   <div className="text-14 ink">{kw.added_bullet}</div>
                 </div>
 
                 <div className="kw-action-row">
                   <div className="flex-row-center gap-10">
                     <button className="btn-outline-red" onClick={() => handleDecision(kw.id, 'rejected')}><X size={14}/> Reject</button>
                     <button className="btn-outline-blue"><Edit2 size={14}/> Edit</button>
                   </div>
                   <div className="flex-row-center gap-10">
                     <button className="btn-purple-filled" onClick={() => handleDecision(kw.id, 'accepted')}>Accept Modification</button>
                     <button className="btn-green-filled" onClick={() => handleDecision(kw.id, 'accepted')}>Accept Addition</button>
                   </div>
                 </div>
               </div>
             )
          }

          if (kw.match_type === 'not_applicable') {
             return (
               <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-not_applicable">
                 <div className="kw-header-row">
                   <div>
                     <div className="kw-label-muted">SKIPPED KEYWORDS</div>
                     <div className="kw-title-flex"><div className="red-dot"/> {kw.keyword}</div>
                   </div>
                   <div className="kw-badge red">⊗ NOT APPLICABLE</div>
                 </div>
                 <div className="kw-placement muted margin-b-16">Integration Strategy: ✗ Not Applicable · Placement: N/A</div>
                 
                 <div className="kw-box grey margin-b-16">
                   <div className="font-bold-12 ink margin-b-6">Reasoning:</div>
                   <div className="text-14 muted">{kw.reasoning}</div>
                 </div>
 
                 <div className="kw-action-row">
                   <button className="btn-outline-red" onClick={() => handleDecision(kw.id, 'rejected')}><X size={14}/> Reject</button>
                   <button className="btn-outline-blue" onClick={() => handleFixAI(kw.id)}><Wand2 size={14}/> Fix with AI</button>
                 </div>
                 <div className="ai-overlay"><Loader2 className="spinner margin-b-12" size={32} color="var(--blue)" /> AI is checking alternatives...</div>
               </div>
             )
          }
          
        })}
      </div>

      <div className="sticky-bottom-progress-bar">
         <div className="flex-between margin-b-10">
            <span className="text-14-semi">Keywords Integrated: {totalDecided} / {localKeywords.length}</span>
            <div className="pill-tabs flex-row-center gap-8">
              <span className="pill-tab active">Active {localKeywords.length - totalDecided}</span>
              <span className="pill-tab-muted">Matched {totalDecided}</span>
              <span className="pill-tab-muted">Rejected 0</span>
            </div>
         </div>
         <div className="progress-bar-container margin-b-10">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
         </div>
         <div className="flex-between muted text-13">
            <button className="btn-text-muted" disabled>← Previous Section</button>
            <span>Section {SECTIONS.findIndex(s => s.id === activeSection) + 1} of 6</span>
            <button className="btn-text-blue" disabled={!isSectionComplete} onClick={handleNextSection}>Next Section →</button>
         </div>
      </div>

    </div>
  )
}
// Import Loader2 for spinner
import { Loader2 } from 'lucide-react'
