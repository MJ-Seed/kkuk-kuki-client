import { useState, useEffect, useMemo, useCallback } from 'react'
import QuokkaClicker from '../components/QuokkaClicker'
import Leaderboard     from '../components/Leaderboard'

type Leader = { nickname: string; clicks: number }

interface Props {
  nickname: string
}

export default function GamePage({ nickname }: Props) {
  const [clickCount, setClickCount] = useState(0)

  const [leaders, setLeaders] = useState<Leader[]>(() => {
    const quokkaNames = [
      '기쁨쿼카', '운동쿼카', '잠못자쿼카', '연언쿼카', '사랑쿼카', 
      '마스터쿼카', '스마일쿼카', '신입쿼카', '어린쿼카', '여행쿼카',
      '새끼쿼카', '상상쿼카', '자유쿼카', '오렌지쿼카', '우주쿼카',
      '잠못자쿼카', '장난쿼카', '재미쿼카', '전설쿼카', '행복쿼카',
      '오지리쿼카', '오리지널쿼카', '상상쿼카', '신나는쿼카', '신선한쿼카',
      '아기쿼카', '아이스쿼카', '아카데미쿼카', '안녕쿼카', '어른쿼카',
      '얼음쿼카', '연습쿼카', '영웅쿼카', '오전쿼카', '오후쿼카',
      '우산쿼카', '우주쿼카', '운동쿼카', '유머쿼카', '유니크쿼카',
      '유학쿼카', '유행쿼카', '유우쿼카', '유우쿼카', '유우쿼카',
      '유니크쿼카', '유니콘쿼카', '유니버스쿼카', '유니스타쿼카', '유니크쿼카',
    ];

    return Array.from({ length: 100 }, (_, i) => {
      const tier = Math.floor(i / 20);
      const baseScore = tier * 1000;
      const randomOffset = Math.floor(Math.random() * 900);
      
      const nameIndex = i % quokkaNames.length;
      const uniqueNumber = Math.floor(i / quokkaNames.length) + 1;
      const nickname = uniqueNumber > 1 
        ? `${quokkaNames[nameIndex]}${uniqueNumber}` 
        : quokkaNames[nameIndex];
      
      return {
        nickname,
        clicks: baseScore + randomOffset,
      };
    });
  })

  const handleClick = useCallback(() => {
    setClickCount((c) => c + 1)
  }, [])

  useEffect(() => {
    const iv = setInterval(() => {
      setLeaders((prev) => {
        const arr = [...prev];
        const updateCount = Math.floor(Math.random() * 10) + 5;
        
        for (let i = 0; i < updateCount; i++) {
          const idx = Math.floor(Math.random() * arr.length);
          const tier = Math.floor(arr[idx].clicks / 1000);
          const incrementAmount = Math.floor(Math.random() * (tier + 2) * 8) + 3;
          
          arr[idx] = {
            ...arr[idx],
            clicks: arr[idx].clicks + incrementAmount,
          };
        }
        return arr;
      });
    }, 300);
    return () => clearInterval(iv);
  }, []);

  const visibleLeaders = useMemo(() => {
    const all = [...leaders, { nickname, clicks: clickCount }];
    return all;
  }, [leaders, nickname, clickCount])

  return (
    <div className="min-h-screen flex flex-col items-center px-3 py-4 sm:p-6 animate-fade-in-down overflow-hidden bg-[var(--color-beige-100)]/30">
      <div className="mb-2 sm:mb-3 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-accent)] mb-1 animate-pulse">꾹꾹이</h1>
        <div className="h-1 w-12 sm:w-16 bg-[var(--color-accent)] mx-auto rounded-full mb-1 sm:mb-2"></div>
        <h2 className="text-lg sm:text-xl font-medium">안녕하세요, <span className="text-[var(--color-accent-dark)] font-bold">{nickname}</span>님!</h2>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-3 sm:gap-4 md:gap-6 flex-1 overflow-hidden">
        <div className="w-full md:flex-1 flex justify-center mb-3 md:mb-0">
          <div className="card-beige p-3 sm:p-4 w-full max-w-md shadow-md">
            <QuokkaClicker count={clickCount} onClick={handleClick} />
          </div>
        </div>
        <div className="w-full md:flex-1 flex justify-center">
          <Leaderboard leaders={visibleLeaders} myNickname={nickname} />
        </div>
      </div>
      
      <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-[var(--color-accent)] opacity-70">
        <p>꾹꾹이를 클릭해서 점수를 올려보세요! 구간별 순위도 확인해주세요!</p>
      </div>
    </div>
  )
}
