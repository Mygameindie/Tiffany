/* toggleDragLatch.js
   Drag the token onto the small button to LATCH base2 ON.
   It stays ON while the token remains overlapping the button,
   even after you release. Move the token away => base2 OFF.
*/
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const BUTTON_SEL = '.small-button.button-1';
    const TOKEN_ID   = 'toggleToken';
    const BASE2_ID   = 'base2-image';

    const token  = document.getElementById(TOKEN_ID);
    const button = document.querySelector(BUTTON_SEL);
    const base2  = document.getElementById(BASE2_ID);
    const container = document.querySelector('.base-container') || document.body;

    if (!token || !button || !base2) return;

    // Start hidden
    if (!base2.style.display) base2.style.display = 'none';

    // Safety styles (prefer real CSS)
    token.style.touchAction = token.style.touchAction || 'none';
    token.style.position    = token.style.position    || 'absolute';
    token.style.zIndex      = token.style.zIndex      || '9999';

    const rect = (el) => el.getBoundingClientRect();
    const overlapping = (a, b) => {
      const A = rect(a), B = rect(b);
      return !(A.right < B.left || A.left > B.right || A.bottom < B.top || A.top > B.bottom);
    };
    const clampToContainer = (x, y, el, within) => {
      const r = rect(el), cr = rect(within);
      const maxX = cr.width  - r.width;
      const maxY = cr.height - r.height;
      const nx = Math.min(Math.max(x, cr.left), cr.left + maxX);
      const ny = Math.min(Math.max(y, cr.top),  cr.top  + maxY);
      return { x: nx, y: ny };
    };
    const placeAtViewportXY = (el, vx, vy) => {
      const parentRect = (el.style.position === 'fixed')
        ? { left: 0, top: 0 }
        : (el.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 });
      el.style.left = (vx - parentRect.left) + 'px';
      el.style.top  = (vy - parentRect.top)  + 'px';
    };

    let dragging = false;
    let offsetX = 0, offsetY = 0;

    function setLatchedState(latched) {
      base2.style.display = latched ? 'block' : 'none';
      button.classList.toggle('active', latched);
      button.setAttribute('aria-pressed', String(latched));
    }

    function onPointerDown(e) {
      // Start drag (no forwarding; latching is controlled by token position)
      e.preventDefault();
      dragging = true;
      token.classList.add('dragging');
      token.setPointerCapture?.(e.pointerId);

      const r = rect(token);
      offsetX = e.clientX - r.left;
      offsetY = e.clientY - r.top;
    }

    function onPointerMove(e) {
      if (!dragging) return;

      const desiredX = e.clientX - offsetX;
      const desiredY = e.clientY - offsetY;
      const { x, y } = clampToContainer(desiredX, desiredY, token, container);
      placeAtViewportXY(token, x, y);

      // Live preview while dragging: ON only if overlapping
      setLatchedState(overlapping(token, button));
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      token.classList.remove('dragging');
      token.releasePointerCapture?.(e.pointerId);

      // LATCH decision: if overlapping at drop, keep ON; else OFF
      setLatchedState(overlapping(token, button));
    }

    token.addEventListener('pointerdown', onPointerDown, { passive: false });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup',   onPointerUp,   { passive: true });
  });
})();