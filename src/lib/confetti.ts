/** Small confetti burst from an element. No-op when the user prefers reduced motion. */
const COLORS = ['var(--sakura)', 'var(--sunny)', 'var(--matcha)', 'var(--ramune)', 'var(--primary)'];

export function confettiBurst(from: HTMLElement, count = 18): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = from.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, {
    position: 'fixed',
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top + rect.height / 2}px`,
    pointerEvents: 'none',
    zIndex: '60',
  });
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 50 + Math.random() * 50;
    Object.assign(p.style, {
      position: 'absolute',
      width: `${6 + Math.random() * 5}px`,
      height: `${8 + Math.random() * 6}px`,
      background: COLORS[i % COLORS.length],
      border: '1.5px solid var(--line)',
      borderRadius: i % 3 === 0 ? '999px' : '2px',
      animation: `confetti-fall ${600 + Math.random() * 300}ms ease-out forwards`,
    });
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist + 30}px`);
    p.style.setProperty('--rot', `${Math.random() * 540 - 270}deg`);
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 1000);
}

/** Restart a CSS animation class on an element (bounce / shake). */
export function replayAnimation(el: HTMLElement, cls: 'anim-bounce' | 'anim-shake'): void {
  el.classList.remove(cls);
  void el.offsetWidth; // force reflow so the animation restarts
  el.classList.add(cls);
}
