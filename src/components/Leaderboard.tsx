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
  // Include all leaders in the display list, including the user
  const displayLeaders = tierLeaders.slice(0, 9);
  
  return (
    <div className="card-beige p-3 sm:p-4 w-full max-w-md shadow-md">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-accent-dark)]">리더보드</h3>
          <div className="text-xs font-medium text-[var(--color-accent)]">
            <span className="font-bold">{tierName}</span> 티어 ({currentTier} - {nextTier-1})
          </div>
        </div>
        <div className="flex items-center">
          <div className="px-2 py-1 bg-[var(--color-accent)] rounded-md text-white text-xs font-medium shadow-sm">
            {myRank}위 / {tierLeaders.length}명
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="bg-[var(--color-beige-200)] rounded-lg p-1.5 sm:p-2 mb-2 shadow-sm">
          <div className="text-sm font-medium text-[var(--color-accent-dark)] text-center">
            내 점수
          </div>
        </div>
        
        <div className="bg-[var(--color-highlight)] border-2 border-[var(--color-accent)] rounded-lg p-2 sm:p-3 flex items-center justify-between animate-pulse shadow-md">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[var(--color-accent)] mr-2 shadow-sm">
              <span className="text-white font-bold text-xs">{myRank}</span>
            </div>
            <span className="font-bold text-[var(--color-accent-dark)] text-sm sm:text-base">{myNickname}</span>
          </div>
          <span className="tabular-nums font-bold text-[var(--color-accent-dark)] text-base sm:text-lg">
            {myClicks.toLocaleString()}
          </span>
        </div>
        
        <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs space-y-1 sm:space-y-0">
          <div className="bg-[var(--color-beige-100)]/60 px-2 py-1 rounded-full">
            <span className="text-[var(--color-accent-dark)] font-medium">다음 티어까지:</span> 
            <span className="font-bold ml-1">{(nextTier - myClicks).toLocaleString()}</span>
          </div>
          <div className="bg-[var(--color-beige-100)]/60 px-2 py-1 rounded-full">
            <span className="text-[var(--color-accent-dark)] font-medium">순위 상승까지:</span> 
            <span className="font-bold ml-1">
              {myRank > 1 ? (tierLeaders[myRank - 2].clicks - myClicks + 1).toLocaleString() : '-'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--color-beige-100)] rounded-md p-1 mb-2 shadow-sm">
        <div className="flex justify-between items-center px-2 py-1 text-xs font-medium text-[var(--color-accent-dark)]">
          <span className="w-5 sm:w-5 text-center">순위</span>
          <span className="flex-1 ml-1 sm:ml-2">닉네임</span>
          <span>점수</span>
        </div>
      </div>
      
      <ul className="space-y-1 max-h-[160px] sm:max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--color-beige-300)] scrollbar-track-transparent">
        {displayLeaders.map((l, i) => {
          const leaderRank = tierLeaders.findIndex(tl => tl.nickname === l.nickname) + 1;
          const isTop3 = leaderRank <= 3;
          const isMe = l.nickname === myNickname;
          
          return (
            <li
              key={i}
              className={`flex items-center px-2 py-1.5 sm:py-2 rounded-md transition-highlight ${
                isMe
                  ? 'bg-[var(--color-highlight)] border-2 border-[var(--color-accent)] shadow-md'
                  : isTop3 
                    ? 'bg-[var(--color-beige-200)] text-[var(--color-accent-dark)] shadow-sm'
                    : 'bg-white'
              }`}
            >
              <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${
                isMe 
                  ? 'bg-[var(--color-accent)]'
                  : isTop3 
                    ? 'bg-[var(--color-accent)]' 
                    : 'bg-[var(--color-beige-300)]'
              }`}>
                <span className={`${
                  isMe || isTop3 ? 'text-white' : 'text-[var(--color-accent-dark)]'
                } font-bold text-xs`}>{leaderRank}</span>
              </div>
              
              <span className={`flex-1 truncate text-xs sm:text-sm ml-1.5 sm:ml-2 ${isMe ? 'font-bold' : ''}`}>{l.nickname}</span>
              
              <span className={`tabular-nums font-semibold text-right text-xs sm:text-sm ${isMe ? 'font-bold' : ''}`}>
                {l.clicks.toLocaleString()}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
