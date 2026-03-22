'use client';
import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    if (window.innerWidth < 768 || ('ontouchstart' in window)) return;
    
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    
    dot.className = 'custom-cursor-dot';
    ring.className = 'custom-cursor-ring';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: none !important; }
      .custom-cursor-dot {
        position: fixed; top: 0; left: 0; width: 10px; height: 10px;
        background: #3498db; border-radius: 50%; pointer-events: none; z-index: 999999;
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease-out;
      }
      .custom-cursor-ring {
        position: fixed; top: 0; left: 0; width: 40px; height: 40px;
        border: 1.5px solid rgba(52, 152, 219, 0.6); border-radius: 50%;
        pointer-events: none; z-index: 999998;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, background 0.2s, border-color 0.2s;
      }
      .custom-cursor-ring.hover {
        width: 60px; height: 60px; background: rgba(52, 152, 219, 0.1); border-color: transparent;
      }
      .custom-cursor-dot.click {
        transform: translate(-50%, -50%) scale(0.6);
      }
    `;
    document.head.appendChild(style);
    
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      
      const target = e.target as HTMLElement;
      if (target) {
        const computed = window.getComputedStyle(target);
        const isClickable = computed.cursor === 'pointer' || target.closest('a') || target.closest('button');
        if (isClickable) ring.classList.add('hover');
        else ring.classList.remove('hover');
      }
    };
    
    const onMouseDown = () => dot.classList.add('click');
    const onMouseUp = () => dot.classList.remove('click');
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    let frameId: number;
    const render = () => {
      ringX += (mouseX - ringX) * 0.20;
      ringY += (mouseY - ringY) * 0.20;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      frameId = requestAnimationFrame(render);
    };
    render();
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(frameId);
      if (dot.parentNode) dot.remove();
      if (ring.parentNode) ring.remove();
      if (style.parentNode) style.remove();
    };
  }, []);

  return null;
}
