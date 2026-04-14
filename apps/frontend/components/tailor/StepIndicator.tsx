export default function StepIndicator({
  currentStep,
  title,
}: {
  currentStep: number
  title: string
}) {
  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Preview' },
    { num: 3, label: 'Review' },
    { num: 4, label: 'Export' }
  ]

  return (
    <div className="step-indicator-container">
      <div className="step-indicator-title">{`Step ${currentStep} of 4 — ${title}`}</div>
      <div className="step-indicator-dots">
        {steps.map((step, idx) => (
          <div key={step.num} className="step-dot-wrapper">
            <div
              className={`step-dot ${currentStep === step.num ? 'active' : currentStep > step.num ? 'completed' : 'inactive'}`}
            >
              {currentStep === step.num && <div className="dot-fill" />}
            </div>
            <span className={`step-label ${currentStep === step.num ? 'active' : 'inactive'}`}>
              {step.label}
            </span>
            {idx < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>
    </div>
  )
}
