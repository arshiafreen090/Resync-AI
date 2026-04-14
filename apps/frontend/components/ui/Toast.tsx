'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]) // Max 3 stacked

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getStyleForType = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { icon: <CheckCircle2 size={18} color="white" />, bg: '#19A667' }
      case 'error':
        return { icon: <XCircle size={18} color="white" />, bg: '#EF4444' }
      case 'info':
        return { icon: <Info size={18} color="white" />, bg: '#1A56FF' }
      case 'warning':
        return { icon: <AlertTriangle size={18} color="white" />, bg: '#D97706' }
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => {
          const { icon, bg } = getStyleForType(toast.type)
          return (
            <div
              key={toast.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 32px rgba(14,12,10,0.12)',
                padding: '14px 18px',
                minWidth: '280px',
                maxWidth: '380px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'slideIn 0.3s ease forwards',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div style={{ flex: 1, fontSize: '14px', fontFamily: 'var(--font-dm-sans)', color: 'var(--ink)' }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'rgba(14,12,10,0.4)',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </ToastContext.Provider>
  )
}
