/* pressHoldButton.js
   Small button acts as a momentary switch:
   - pointerdown => show base2
   - pointerup/cancel => hide base2
*/
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.small-button.button-1');
  const base2  = document.getElementById('base2-image');
  if (!button || !base2) return;

  // Start at base
  base2.style.display = 'none';
  button.classList.remove('active');
  button.setAttribute('aria-pressed', 'false');

  const showBase2 = () => {
    base2.style.display = 'block';
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
  };
  const hideBase2 = () => {
    base2.style.display = 'none';
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  };

  function onPointerDown(e) {
    e.preventDefault(); // prevents extra click on touch
    button.setPointerCapture?.(e.pointerId);
    showBase2();
  }
  function onPointerUp(e) {
    hideBase2();
    button.releasePointerCapture?.(e.pointerId);
  }

  button.addEventListener('pointerdown', onPointerDown, { passive: false });
  button.addEventListener('pointerup',   onPointerUp,   { passive: true });
  button.addEventListener('pointercancel', onPointerUp, { passive: true });
  button.addEventListener('lostpointercapture', onPointerUp, { passive: true });

  // Keyboard (momentary)
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  button.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); showBase2(); }
  });
  button.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); hideBase2(); }
  });
});