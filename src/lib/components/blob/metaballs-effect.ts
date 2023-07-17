import { Ball } from './ball';

export class MetaballsEffect {
	balls: Ball[];

	constructor(
		public width: number,
		public height: number
	) {
		this.balls = [];
	}

	init(numberOfBalls: number) {
		for (let i = 0; i < numberOfBalls; i++) {
			this.balls.push(new Ball(this));
		}
	}

	update() {
		this.balls.forEach((ball) => ball.update());
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.balls.forEach((ball) => ball.draw(ctx));
	}

	reset(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.balls.forEach((ball) => ball.reset());
	}
}
