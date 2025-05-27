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
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const clickTimeoutRef = useRef<number | null>(null)
  const defaultQuokkaRef = useRef<HTMLImageElement | null>(null)
  const smileQuokkaRef = useRef<HTMLImageElement | null>(null)

  // 이미지 프리로딩 처리
  useEffect(() => {
    // 기본 쿼카 이미지 프리로드
    const defaultImg = new Image()
    defaultImg.src = defaultQuokka
    defaultQuokkaRef.current = defaultImg
    
    // 스마일 쿼카 이미지 프리로드
    const smileImg = new Image()
    smileImg.src = smileQuokka
    smileQuokkaRef.current = smileImg
    
    // 두 이미지가 모두 로드되면 상태 업데이트
    Promise.all([
      new Promise(resolve => {
        defaultImg.onload = resolve
        if (defaultImg.complete) resolve(null)
      }),
      new Promise(resolve => {
        smileImg.onload = resolve
        if (smileImg.complete) resolve(null)
      })
    ]).then(() => {
      setImagesLoaded(true)
    })

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
          className={`w-full h-full object-cover transition-all-smooth ${imagesLoaded ? '' : 'opacity-0'}`}
          style={{ transform: pressed ? 'scale(1.05)' : 'scale(1)' }}
          draggable="false"
        />
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-beige-100)]">
            <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <div className="mt-2 sm:mt-3 text-center">
        <div className="inline-block px-3 py-1 bg-[var(--color-beige-200)] rounded-full text-xs font-medium text-[var(--color-accent-dark)] shadow-sm">
          꾹꾹이를 클릭해주세요!
        </div>
      </div>
    </div>
  )
}
