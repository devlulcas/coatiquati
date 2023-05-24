import type { MetaballsEffect } from './metaballs-effect';

export class Ball {
	x: number;
	y: number;
	radius: number;
	speedX: number;
	speedY: number;

	constructor(private effect: MetaballsEffect) {
		this.x = this.effect.width * 0.25;
		this.y = this.effect.height * 0.25;
		this.radius = Math.random() * 100 + 20;
		this.speedX = Math.random() * 5 - 2.5;
		this.speedY = Math.random() * 5 - 2.5;
	}

	update() {
		if (this.x < this.radius || this.x > this.effect.width - this.radius) {
			this.speedX *= -1;
		}

		if (this.y < this.radius || this.y > this.effect.height - this.radius) {
			this.speedY *= -1;
		}

		this.x += this.speedX;
		this.y += this.speedY;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}

	reset() {
		this.x = this.effect.width * 0.5;
		this.y = this.effect.height * 0.5;
	}
}
