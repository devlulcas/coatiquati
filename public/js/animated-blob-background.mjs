import { MetaballsEffect } from './metaballs-effect.mjs';

function* getRandomColor() {
  const colors = ['#9333ea', '#22d3ee', '#c026d3', '#db2777', '#8b5cf6', '#3b82f6'];
  let index = 0;
  while (true) {
    yield colors[index++ % colors.length];
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 */
function paintGradient(canvas, ctx) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  const colorGenerator = getRandomColor();
  gradient.addColorStop(0, colorGenerator.next().value);
  gradient.addColorStop(0.2, colorGenerator.next().value);
  gradient.addColorStop(0.5, colorGenerator.next().value);
  gradient.addColorStop(1, colorGenerator.next().value);
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
  `,
);

const ctx = canvas.getContext('2d');

const effect = new MetaballsEffect(window.innerWidth, window.innerHeight);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paintGradient(canvas, ctx);

effect.init(25);

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

window.REMOVE_ANIMATED_BLOB_BACKGROUND = () => {
  if (canvas.parentNode) document.body.removeChild(canvas);
};

window.ADD_ANIMATED_BLOB_BACKGROUND = () => {
  document.body.appendChild(canvas);
};
