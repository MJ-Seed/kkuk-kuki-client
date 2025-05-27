import { useState, useEffect, useRef } from 'react'
import defaultQuokka from '@assets/quokka-default.png'
import smileQuokka   from '@assets/quokka-smile.png'

interface Props {
  onClick: () => void
  count: number
}

export default function QuokkaClicker({ onClick, count }: Props) {
  const [pressed, setPressed] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const clickTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current !== null) {
        window.clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const handleDown = () => {
    if (isClicking) return
    
    setPressed(true)
    setIsClicking(true)
    onClick()

    clickTimeoutRef.current = window.setTimeout(() => {
      setIsClicking(false)
    }, 50)
  }
  
  const handleUp = () => {
    setPressed(false)
  }

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="text-center mb-2 sm:mb-3">
        <span className="text-xl sm:text-2xl font-bold text-[var(--color-accent-dark)] tabular-nums transition-all-smooth">
          {count.toLocaleString()}
        </span>
        <p className="text-xs text-[var(--color-accent)] mt-0.5">클릭 점수</p>
      </div>
      
      <div
        className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden cursor-pointer relative transition-all-smooth active:scale-95"
        style={{
          boxShadow: pressed 
            ? '0 3px 6px rgba(161, 134, 116, 0.15)' 
            : '0 8px 16px rgba(161, 134, 116, 0.25), 0 4px 8px rgba(161, 134, 116, 0.15)'
        }}
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchEnd={handleUp}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-beige-200)] to-transparent opacity-40 z-10"></div>
        <div className="absolute inset-0 bg-[var(--color-accent)]/10 opacity-0 hover:opacity-30 z-10 transition-opacity"></div>
        <img
          src={pressed ? smileQuokka : defaultQuokka}
          alt="쿼카"
          className="w-full h-full object-cover transition-all-smooth"
          style={{ transform: pressed ? 'scale(1.05)' : 'scale(1)' }}
          draggable="false"
        />
      </div>
      
      <div className="mt-2 sm:mt-3 text-center">
        <div className="inline-block px-3 py-1 bg-[var(--color-beige-200)] rounded-full text-xs font-medium text-[var(--color-accent-dark)] shadow-sm">
          꾹꾹이를 클릭해주세요!
        </div>
      </div>
    </div>
  )
}
