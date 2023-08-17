import { MetaballsEffect } from './metaballs-effect.mjs';

/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 */
function paintGradient(canvas, ctx) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#9333ea');
  gradient.addColorStop(0.2, '#22d3ee');
  gradient.addColorStop(0.5, '#c026d3');
  gradient.addColorStop(1, '#db2777');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const canvas = document.createElement('canvas');

canvas.setAttribute(
  'style',
  `
    filter: url(#blob-blur);
    height: 100vh;
    width: 100vw;
    outline: none;
    z-index: -1;
    position: fixed;
    inset: 0;
    user-select: none;
    pointer-events: none;
    will-change: transform;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  `
);

const ctx = canvas.getContext('2d');

const effect = new MetaballsEffect(window.innerWidth, window.innerHeight);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paintGradient(canvas, ctx);

effect.init(15);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  paintGradient(canvas, ctx);
  effect.reset(window.innerWidth, window.innerHeight);
});

/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 */
function animate() {
  requestAnimationFrame(() => animate(canvas, ctx));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.update();
  effect.draw(ctx);
}

animate();

document.body.appendChild(canvas);
