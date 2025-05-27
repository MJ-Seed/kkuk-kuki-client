import React, { useState, useEffect } from 'react'

interface Props {
  existingNicknames: string[]
  onStart: (nickname: string) => void
}

export default function NicknameModal({ existingNicknames, onStart }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (leaving) {
      const t = setTimeout(() => onStart(name.trim()), 300)
      return () => clearTimeout(t)
    }
  }, [leaving, name, onStart])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value
    if (v.length > 10) v = v.slice(0, 10)
    setName(v)
    if (error) setError('')
  }

  const handleSubmit = () => {
    const t = name.trim()
    if (t.length < 2) {
      setError('닉네임은 최소 2자 이상 입력해주세요.')
      return
    }
    if (existingNicknames.includes(t)) {
      setError('이미 사용 중인 닉네임입니다.')
      return
    }
    setLeaving(true)
  }

  return (
    <div
      className={`fixed inset-0 bg-[var(--color-beige-100)]/90 backdrop-blur-md flex items-center justify-center ${
        leaving ? 'animate-fade-out-up' : 'animate-fade-in-down'
      }`}
    >
      <div className="card-beige p-6 sm:p-8 w-[90%] max-w-sm sm:max-w-md text-center transition-all shadow-lg">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-accent)] mb-2 animate-pulse">꾹꾹이</h1>
          <div className="h-1 w-16 bg-[var(--color-accent)] mx-auto rounded-full mb-3 sm:mb-4"></div>
          <h2 className="text-lg sm:text-xl font-medium text-[var(--color-accent-dark)]">닉네임을 입력해주세요</h2>
        </div>
        
        <div className="mb-5 sm:mb-6">
          <div className="relative">
            <input
              className={`w-full p-3 sm:p-4 pl-4 pr-10 border-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all ${
                error ? 'border-[var(--color-error)]' : 'border-[var(--color-beige-300)]'
              } text-base`}
              placeholder="2~10자"
              value={name}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            {name && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-[var(--color-accent)]">
                {name.length}/10
              </div>
            )}
          </div>
          {error && (
            <p className="text-sm text-[var(--color-error)] mt-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>
        
        <button
          className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg font-medium transition-all-smooth disabled:opacity-50 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98]"
          onClick={handleSubmit}
          disabled={name.trim().length < 2}
        >
          시작하기
        </button>
        
        <p className="mt-4 text-xs sm:text-sm text-[var(--color-accent)] opacity-70">
          꾹꾹이를 클릭해서 점수를 올리고 다른 사용자들과 경쟁해보세요!
        </p>
      </div>
    </div>
  )
}
