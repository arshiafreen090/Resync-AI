import { Check } from 'lucide-react'

export default function SectionProgress({
  sections,
  currentSection,
  onSectionClick
}: {
  sections: { id: string, label: string, status: 'completed' | 'active' | 'upcoming' }[]
  currentSection: string
  onSectionClick: (id: string) => void
}) {
  return (
    <div className="section-progress-bar">
      <span className="section-progress-label">Section Progress:</span>
      <div className="section-pills-row">
        {sections.map((sec) => (
          <button
            key={sec.id}
            className={`section-pill ${sec.status}`}
            onClick={() => {
              if (sec.status === 'completed') onSectionClick(sec.id)
            }}
            disabled={sec.status === 'upcoming'}
          >
            {sec.status === 'completed' && <Check size={12} className="margin-r-4" />}
            {sec.status === 'active' && <div className="active-dot margin-r-4" />}
            {sec.label}
          </button>
        ))}
      </div>
    </div>
  )
}
