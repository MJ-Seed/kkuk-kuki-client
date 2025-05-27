import { useState, useMemo } from 'react'
import NicknameModal from './components/NicknameModal'
import GamePage from './pages/GamePage'

export default function App() {
  const initialUsers = useMemo(
    () => Array.from({ length: 50 }, (_, i) => `user${i + 1}`),
    []
  )
  const [existingNicknames, setExistingNicknames] = useState<string[]>(initialUsers)
  const [nickname, setNickname] = useState('')
  const [started, setStarted] = useState(false)

  const handleStart = (name: string) => {
    setExistingNicknames((prev) => [...prev, name])
    setNickname(name)
    setStarted(true)
  }

  return (
    <>
      {!started && (
        <NicknameModal
          existingNicknames={existingNicknames}
          onStart={handleStart}
        />
      )}
      {started && <GamePage nickname={nickname} />}
    </>
  )
}
