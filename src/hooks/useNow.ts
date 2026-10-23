import { useEffect, useState } from 'react'

/** Data atual, atualizada a cada virada de minuto. */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let interval: number | undefined
    const tick = () => setNow(new Date())
    const timeout = window.setTimeout(
      () => {
        tick()
        interval = window.setInterval(tick, 60_000)
      },
      60_000 - (Date.now() % 60_000) + 50,
    )
    const onVisible = () => document.visibilityState === 'visible' && tick()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return now
}
