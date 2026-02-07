import confetti from 'canvas-confetti'

const THEME_COLORS = ['#7c3aed', '#a78bfa', '#6d28d9', '#c4b5fd', '#ede9fe']

export function fireFiestaConfetti(): void {
  const duration = 2_000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: THEME_COLORS,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: THEME_COLORS,
    })
    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: THEME_COLORS,
      scalar: 1.1,
    })
  }, 200)
}
