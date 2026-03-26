'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepIndicator from '@/components/tailor/StepIndicator'
import ATSScoreRing from '@/components/resume/ATSScoreRing'
import { FileText, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function TailorEditorPage() {
  const router = useRouter()
  const { showToast } = useToast()
  
  const [isExporting, setIsExporting] = useState(false)

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    showToast('Generating PDF...', 'info')
    
    // Dynamically import jsPDF to avoid SSR issues
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setProperties({
        title: 'Tailored Resume',
        subject: 'ReSync AI Generated Resume'
      })

      // Simple mock rendering
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('John Doe', 20, 20)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text('j.doe@gmail.com | linkedin.com/in/jdoe | San Francisco, CA', 20, 26)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('EXPERIENCE', 20, 40)
      doc.line(20, 42, 190, 42)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      const bullets = [
        "Developed machine learning algorithms to analyze user behavior patterns and improve recommendation systems.",
        "Performed comprehensive data analysis using SQL to analyze customer feedback.",
        "Leveraged advanced SQL queries to extract insights from large datasets."
      ]

      let y = 50
      bullets.forEach(b => {
        const split = doc.splitTextToSize(`• ${b}`, 170)
        doc.text(split, 20, y)
        y += split.length * 5 + 2
      })

      doc.save(`Resume_Tailored_${new Date().toISOString().split('T')[0]}.pdf`)
      
      setIsExporting(false)
      showToast('PDF Exported Successfully!', 'success')
      
    } catch (e) {
      setIsExporting(false)
      showToast('Failed to generate PDF', 'error')
    }
  }

  const handleDownloadDocs = () => {
    showToast('DOCX export coming soon', 'info')
  }

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={4} title="Review & Export" />

      <div className="editor-three-col-grid margin-t-24">
        
        {/* COLUMN 1: Original */}
        <div className="editor-col">
          <div className="sticky-pill-header pill-original">ORIGINAL</div>
          <div className="resume-paper-card">
            <div className="paper-name">John Doe</div>
            <div className="paper-contact">j.doe@gmail.com · San Francisco, CA · linkedin.com/in/jdoe</div>
            
            <div className="paper-section-header">EXPERIENCE</div>
            <div className="paper-job-title">SWE Intern at Google</div>
            <ul className="paper-bullets">
              <li>Developed predictive algorithms to analyze user behavior patterns and improve recommendation systems for e-commerce platform.</li>
              <li>Collaborated with cross-functional teams to design architecture.</li>
            </ul>

            <div className="paper-job-title">Product Intern at Flipkart</div>
            <ul className="paper-bullets">
              <li>Analyzed customer feedback and market trends to identify product improvement opportunities.</li>
            </ul>
          </div>
        </div>

        {/* COLUMN 2: Tailored Live */}
        <div className="editor-col">
          <div className="sticky-pill-header pill-tailored">TAILORED ✓ Live</div>
          <div className="resume-paper-card">
             <div className="paper-name">John Doe</div>
             <div className="paper-contact">j.doe@gmail.com · San Francisco, CA · linkedin.com/in/jdoe</div>
            
             <div className="paper-section-header">EXPERIENCE</div>
             <div className="paper-job-title">SWE Intern at Google</div>
             <ul className="paper-bullets">
               <li>Developed <mark className="diff-modified">machine learning</mark> algorithms to analyze user behavior patterns and improve recommendation systems for e-commerce platform.</li>
               <li>Collaborated with cross-functional teams to design architecture.</li>
             </ul>

             <div className="paper-job-title">Product Intern at Flipkart</div>
             <ul className="paper-bullets">
               <li><mark className="diff-modified">Performed comprehensive data analysis using SQL to analyze</mark> customer feedback and market trends to identify product improvement opportunities.</li>
               <li className="diff-added-li"><mark className="diff-added">Leveraged advanced SQL queries and data analysis techniques to extract insights from large datasets, supporting data-driven decision making across teams.</mark></li>
             </ul>
          </div>
        </div>

        {/* COLUMN 3: Export Side Bar */}
        <div className="editor-export-col">
          <div className="export-card-white">
            <h3 className="uppercase-label margin-b-16">ATS SCORE</h3>
            
            <div className="text-10-muted absolute-before-score text-center">Before <br/> 62</div>
            <div className="flex-col-center margin-b-16 margin-t-24">
               <ATSScoreRing score={87} size={120} animated={true} showLabel={false} />
            </div>

            <div className="flex-col-center margin-b-24">
               <div className="green-pill-large margin-b-12">+25 pts</div>
               <div className="text-13-semi">12 / 24 keywords integrated</div>
               <div className="progress-bar-container margin-t-12 w-full">
                 <div className="progress-bar-fill-gradient" style={{ width: '50%' }} />
               </div>
            </div>

            <hr className="divider-card margin-b-16" />

            <button 
              className="btn-export-pdf" 
              onClick={handleDownloadPDF}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 size={16} className="spinner" /> : <FileText size={16} />} 
              {isExporting ? 'Generating...' : 'Download PDF'}
            </button>
            
            <button className="btn-export-docx" onClick={handleDownloadDocs}>
              <span className="doc-icon margin-r-8">📝</span> Download DOCX
            </button>
            
            <hr className="divider-card margin-b-16" />

            <div className="flex-col-center">
              <button className="tailor-another-link" onClick={() => router.push('/tailor')}>
                Tailor for another job →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
