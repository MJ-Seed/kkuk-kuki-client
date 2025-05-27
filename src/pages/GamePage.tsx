import { useState, useEffect, useMemo, useCallback } from 'react'
import QuokkaClicker from '../components/QuokkaClicker'
import Leaderboard from '../components/Leaderboard'
// import { sendClick, getLeaderboard, setupWebSocket, Leader } from '../services/api'

type Leader = { nickname: string; clicks: number }

interface Props {
  nickname: string
}

export default function GamePage({ nickname }: Props) {
  const [clickCount, setClickCount] = useState(0)
  // Spring Boot 백엔드 연동 시 사용할 상태 변수들
  /*
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)
  */

  const [leaders, setLeaders] = useState<Leader[]>(() => {
    const quokkaNames = [
      '기쁜 쿼카', '운동하는 쿼카', '잠자는 쿼카', '연인 쿼카', '사랑하는 쿼카', 
      '마스터 쿼카', '스마일 쿼카', '신입 쿼카', '어린 쿼카', '여행하는 쿼카',
      '새끼 쿼카', '상상하는 쿼카', '자유로운 쿼카', '오렌지 쿼카', '우주 쿼카',
      '장난하는 쿼카', '재미있는 쿼카', '전설의 쿼카', '행복한 쿼카', '오지는 쿼카', 
      '오리지널 쿼카', '신난 쿼카', '신선한 쿼카', '아기 쿼카', '아이스 쿼카', 
      '아카데미 쿼카', '안녕하는 쿼카', '어른 쿼카', '얼음 쿼카', '연습하는 쿼카', 
      '영웅 쿼카', '오전 쿼카', '오후 쿼카', '우산 쿼카', '유머러스한 쿼카', 
      '유니크 쿼카', '유학 쿼카', '유행 쿼카', '우유 쿼카', '유니콘 쿼카', 
      '유니버스 쿼카', '유니스타 쿼카', '귀여운 쿼카', '똑똑한 쿼카', '멋진 쿼카',
      '용감한 쿼카', '친절한 쿼카', '활발한 쿼카', '차분한 쿼카', '예쁜 쿼카',
      '멋쟁이 쿼카', '씩씩한 쿼카', '당당한 쿼카', '행운 쿼카', '지혜 쿼카',
      '명예 쿼카', '열정 쿼카', '도전 쿼카', '성공 쿼카', '희망 쿼카',
      '꿈꾸는 쿼카', '도약 쿼카', '성장 쿼카', '미래 쿼카', '기적 쿼카',
      '환상 쿼카', '마법 쿼카', '신비 쿼카', '모험 쿼카', '탐험 쿼카',
      '발견 쿼카', '창조 쿼카', '발명 쿼카', '혁신 쿼카', '선구 쿼카',
      '선도 쿼카', '선봉 쿼카', '선두 쿼카', '최고 쿼카', '최상 쿼카',
      '최선 쿼카', '최적 쿼카', '최첨단 쿼카', '최강 쿼카', '최상위 쿼카',
      '일류 쿼카', '일급 쿼카', '일등 쿼카', '일인자 쿼카', '일당백 쿼카',
      '천하무적 쿼카', '무적 쿼카', '무한 쿼카', '무궁 쿼카', '무한대 쿼카',
      '영원 쿼카', '영속 쿼카', '영구 쿼카', '영생 쿼카', '영원한 쿼카',
    ];

    const uniqueQuokkaNames = [...new Set(quokkaNames)];
    const shuffledNames = [...uniqueQuokkaNames].sort(() => Math.random() - 0.5);

    return Array.from({ length: 100 }, (_, i) => {
      const tier = Math.floor(i / 20);
      const baseScore = tier * 1000;
      const randomOffset = Math.floor(Math.random() * 900);
      
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

  // Spring Boot 백엔드 연결 확인 및 초기 데이터 로드
  /*
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true)
        // 서버에서 리더보드 데이터 가져오기 시도
        const serverLeaders = await getLeaderboard()
        
        if (serverLeaders.length > 0) {
          setLeaders(serverLeaders)
          setIsOnline(true)
          console.log('Connected to backend server')
        } else {
          setIsOnline(false)
          console.log('Using offline mode with mock data')
        }
      } catch (error) {
        console.error('Failed to connect to backend:', error)
        setIsOnline(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])
  */

  // WebSocket 연결 설정 (실시간 업데이트)
  /*
  useEffect(() => {
    if (isOnline) {
      // WebSocket 연결 설정
      wsRef.current = setupWebSocket(nickname, (updatedLeaders) => {
        setLeaders(updatedLeaders)
      })

      // 컴포넌트 언마운트 시 WebSocket 연결 종료
      return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close()
        }
      }
    }
  }, [isOnline, nickname])
  */

  // 현재는 로컬에서 리더보드 업데이트 (백엔드 연동 시 수정 예정)
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

  // 클릭 이벤트 핸들러 (백엔드 연동 시 수정 예정)
  const handleClick = useCallback(() => {
    setClickCount((c) => c + 1)
    
    // 백엔드에 클릭 이벤트 전송
    /*
    if (isOnline) {
      sendClick(nickname, clickCount + 1).catch(error => {
        console.error('Failed to send click to server:', error)
      })
    }
    // 의존성 배열에 clickCount 추가해줘야 함
    */
  }, [])

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
        {/* 서버 연결 상태 표시
        {isOnline && (
          <div className="mt-1 flex items-center justify-center">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            <span className="text-xs text-green-600 font-medium">서버 연결됨</span>
          </div>
        )}
        */}
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
        {/* 오프라인 모드 표시
        {!isOnline && (
          <p className="mt-1 text-amber-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
            오프라인 모드: 서버에 연결되지 않았습니다
          </p>
        )}
        */}
      </div>
    </div>
  )
}
