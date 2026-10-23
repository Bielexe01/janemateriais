import { useEffect, useState } from 'react'

/** Retorna o id da seção que está cruzando a faixa central da tela. */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return

    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top)
          else visible.delete(entry.target.id)
        }
        // O mais interno/recente vence (ex.: o card de horário dentro da seção de localização).
        const [first] = [...visible.entries()].sort((a, b) => b[1] - a[1])
        setActive(first ? first[0] : null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return active
}
