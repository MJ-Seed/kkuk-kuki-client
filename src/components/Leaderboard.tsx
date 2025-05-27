interface Leader {
  nickname: string
  clicks: number
}

interface Props {
  leaders: Leader[]
  myNickname: string
}

export default function Leaderboard({ leaders, myNickname }: Props) {
  const myLeader = leaders.find(l => l.nickname === myNickname);
  const myClicks = myLeader?.clicks || 0;

  const tierNames = [
    '아이언', '브론즈', '실버', '골드', '플래티넘', 
    '다이아몬드', '루비', '마스터', '챌린저'
  ];

  const tierIndex = Math.floor(myClicks / 500);
  const tierName = tierNames[Math.min(tierIndex, tierNames.length - 1)];
  const currentTier = Math.floor(myClicks / 500) * 500;
  const nextTier = currentTier + 500;

  const tierLeaders = leaders.filter(l => {
    const clicks = l.clicks;
    return clicks >= currentTier && clicks < nextTier;
  });

  tierLeaders.sort((a, b) => b.clicks - a.clicks);

  const myRank = tierLeaders.findIndex(l => l.nickname === myNickname) + 1;
  const otherLeaders = tierLeaders.filter(l => l.nickname !== myNickname);
  const topOtherLeaders = otherLeaders.slice(0, 9);
  
  return (
    <div className="card-beige p-4 w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-accent-dark)]">리더보드</h3>
          <div className="text-xs font-medium text-[var(--color-accent)]">
            <span className="font-bold">{tierName}</span> 티어 ({currentTier} - {nextTier-1} 점수대)
          </div>
        </div>
        <div className="flex items-center">
          <div className="px-2 py-1 bg-[var(--color-accent)] rounded-md text-white text-xs mr-2">
            {myRank}위 / {tierLeaders.length}명
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="bg-[var(--color-beige-200)] rounded-lg p-2 mb-2">
          <div className="text-sm font-medium text-[var(--color-accent-dark)] text-center">
            내 점수
          </div>
        </div>
        
        <div className="bg-[var(--color-highlight)] border-2 border-[var(--color-accent)] rounded-lg p-3 flex items-center justify-between animate-pulse">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-accent)] mr-2">
              <span className="text-white font-bold text-xs">{myRank}</span>
            </div>
            <span className="font-bold text-[var(--color-accent-dark)]">{myNickname}</span>
          </div>
          <span className="tabular-nums font-bold text-[var(--color-accent-dark)] text-lg">
            {myClicks.toLocaleString()}
          </span>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs">
          <div>
            <span className="text-[var(--color-accent-dark)] font-medium">다음 티어까지:</span> 
            <span className="font-bold ml-1">{(nextTier - myClicks).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[var(--color-accent-dark)] font-medium">순위 상승까지:</span> 
            <span className="font-bold ml-1">
              {myRank > 1 ? (tierLeaders[myRank - 2].clicks - myClicks + 1).toLocaleString() : '-'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--color-beige-100)] rounded-md p-1 mb-2">
        <div className="flex justify-between items-center px-2 py-1 text-xs font-medium text-[var(--color-accent-dark)]">
          <span className="w-8 text-center">순위</span>
          <span className="flex-1 ml-2">닉네임</span>
          <span>점수</span>
        </div>
      </div>
      
      <ul className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
        {topOtherLeaders.map((l, i) => {
          const leaderRank = tierLeaders.findIndex(tl => tl.nickname === l.nickname) + 1;
          const isTop3 = leaderRank <= 3;
          
          return (
            <li
              key={i}
              className={`flex items-center px-2 py-2 rounded-md transition-highlight ${
                isTop3 
                  ? 'bg-[var(--color-beige-200)] text-[var(--color-accent-dark)]'
                  : 'bg-white'
              }`}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isTop3 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-beige-300)]'}`}>
                <span className={`${isTop3 ? 'text-white' : 'text-[var(--color-accent-dark)]'} font-bold text-xs`}>{leaderRank}</span>
              </div>
              
              <span className="flex-1 truncate text-sm ml-2">{l.nickname}</span>
              
              <span className="tabular-nums font-semibold text-right text-sm">
                {l.clicks.toLocaleString()}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
