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
    // Create a list of unique quokka names
    const quokkaNames = [
      '기쁨쿼카', '운동쿼카', '잠자쿼카', '연언쿼카', '사랑쿼카', 
      '마스터쿼카', '스마일쿼카', '신입쿼카', '어린쿼카', '여행쿼카',
      '새끼쿼카', '상상쿼카', '자유쿼카', '오렌지쿼카', '우주쿼카',
      '장난쿼카', '재미쿼카', '전설쿼카', '행복쿼카', '오지리쿼카', 
      '오리지널쿼카', '신나는쿼카', '신선한쿼카', '아기쿼카', '아이스쿼카', 
      '아카데미쿼카', '안녕쿼카', '어른쿼카', '얼음쿼카', '연습쿼카', 
      '영웅쿼카', '오전쿼카', '오후쿼카', '우산쿼카', '유머쿼카', 
      '유니크쿼카', '유학쿼카', '유행쿼카', '유우쿼카', '유니콘쿼카', 
      '유니버스쿼카', '유니스타쿼카', '귀여운쿼카', '똑똑한쿼카', '멋진쿼카',
      '용감한쿼카', '친절한쿼카', '활발한쿼카', '차분한쿼카', '예쁜쿼카',
      '멋쟁이쿼카', '씩씩한쿼카', '당당한쿼카', '행운쿼카', '지혜쿼카',
      '명예쿼카', '열정쿼카', '도전쿼카', '성공쿼카', '희망쿼카',
      '꿈꾸는쿼카', '도약쿼카', '성장쿼카', '미래쿼카', '기적쿼카',
      '환상쿼카', '마법쿼카', '신비쿼카', '모험쿼카', '탐험쿼카',
      '발견쿼카', '창조쿼카', '발명쿼카', '혁신쿼카', '선구쿼카',
      '선도쿼카', '선봉쿼카', '선두쿼카', '최고쿼카', '최상쿼카',
      '최선쿼카', '최적쿼카', '최첨단쿼카', '최강쿼카', '최상위쿼카',
      '일류쿼카', '일급쿼카', '일등쿼카', '일인자쿼카', '일당백쿼카',
      '천하무적쿼카', '무적쿼카', '무한쿼카', '무궁쿼카', '무한대쿼카',
      '영원쿼카', '영속쿼카', '영구쿼카', '영생쿼카', '영원한쿼카',
    ];

    // Remove any duplicates from the quokkaNames array
    const uniqueQuokkaNames = [...new Set(quokkaNames)];
    
    // Shuffle the array to get random order
    const shuffledNames = [...uniqueQuokkaNames].sort(() => Math.random() - 0.5);

    return Array.from({ length: 100 }, (_, i) => {
      const tier = Math.floor(i / 20);
      const baseScore = tier * 1000;
      const randomOffset = Math.floor(Math.random() * 900);
      
      // Ensure each nickname is unique by adding a number if needed
      let nickname;
      if (i < shuffledNames.length) {
        nickname = shuffledNames[i];
      } else {
        const nameIndex = i % shuffledNames.length;
        const uniqueNumber = Math.floor(i / shuffledNames.length) + 1;
        nickname = `${shuffledNames[nameIndex]}${uniqueNumber}`;
      }
      
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
