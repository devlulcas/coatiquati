import { Ball } from './ball.mjs';

export class MetaballsEffect {
  /**
   * @type {Ball[]}
   */
  balls = [];

  /**
   * @type {number}
   */
  width;

  /**
   * @type {number}
   */
  height;

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.balls = [];
  }

  /**
   * @param {number} numberOfBalls
   */
  init(numberOfBalls) {
    for (let i = 0; i < numberOfBalls; i++) {
      this.balls.push(new Ball(this));
    }
  }

  update() {
    this.balls.forEach(ball => ball.update());
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    this.balls.forEach(ball => ball.draw(ctx));
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  reset(width, height) {
    this.width = width;
    this.height = height;
    this.balls.forEach(ball => ball.reset());
  }
}
