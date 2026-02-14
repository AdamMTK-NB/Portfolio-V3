/**
 * Plays the click SFX from your own audio file.
 * Add your sound file at: public/click.mp3
 * (Replace click.mp3 with any short click/lock sound you like.)
 */
const SFX_PATH = '/click.wav'
let audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(SFX_PATH)
  }
  return audio
}

export function playClickSfx(): void {
  try {
    const a = getAudio()
    a.currentTime = 0
    a.volume = 0.7
    // Defer so UI updates (e.g. theme toggle, transitions) run first and feel instant
    const play = () => a.play().catch(() => {})
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => play())
    } else {
      setTimeout(play, 0)
    }
  } catch {
    // Ignore if playback fails (e.g. file missing or autoplay policy)
  }
}
