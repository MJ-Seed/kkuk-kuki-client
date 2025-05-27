// POST /api/clicks - 클릭 이벤트 수신
// GET /api/leaderboard - 전체 리더보드 데이터 제공
// GET /api/leaderboard/tier/{tier} - 특정 티어의 리더보드 데이터 제공
// WebSocket 엔드포인트 /ws/leaderboard - 실시간 리더보드 업데이트

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API 요청 타입 정의
export interface Leader {
  nickname: string;
  clicks: number;
}

// 클릭 이벤트 전송 함수
export async function sendClick(nickname: string, clickCount: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname, clicks: clickCount }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send click:', error);
    // 오프라인 모드에서는 에러를 무시하고 로컬에서 계속 작동하도록 함
  }
}

// 리더보드 데이터 가져오기
export async function getLeaderboard(): Promise<Leader[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    // API 연결 실패 시 빈 배열 반환
    return [];
  }
}

// 특정 티어의 리더보드 데이터 가져오기
export async function getTierLeaderboard(tier: number): Promise<Leader[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/tier/${tier}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch tier leaderboard:', error);
    // API 연결 실패 시 빈 배열 반환
    return [];
  }
}

// WebSocket 연결 설정 (실시간 업데이트용)
export function setupWebSocket(
  nickname: string, 
  onLeaderboardUpdate: (leaders: Leader[]) => void
): WebSocket | null {
  try {
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/leaderboard`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      // 연결 시 사용자 식별 정보 전송
      ws.send(JSON.stringify({ type: 'REGISTER', nickname }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'LEADERBOARD_UPDATE') {
          onLeaderboardUpdate(data.leaders);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to setup WebSocket:', error);
    return null;
  }
}
