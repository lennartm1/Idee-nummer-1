import {
  CEILING_Y,
  CLOUD_SPEED,
  GROUND_HEIGHT,
  GROUND_SCROLL_FACTOR,
  WORLD_HEIGHT,
  WORLD_WIDTH
} from './config';
import { Particle, PipePair, Player } from './types';

export class Renderer {
  private readonly cloudOffsets = [0, 210, 460, 690];

  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  draw(
    elapsed: number,
    player: Player,
    pipes: PipePair[],
    particles: Particle[],
    speed: number,
    shake: number
  ): void {
    this.ctx.save();
    if (shake > 0) {
      this.ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }
    this.drawBackground(elapsed, speed);
    pipes.forEach((pipe) => this.drawPipe(pipe));
    particles.forEach((p) => this.drawParticle(p));
    this.drawPlayer(player);
    this.drawGround(speed, elapsed);
    this.ctx.restore();
  }

  private drawBackground(elapsed: number, speed: number): void {
    const g = this.ctx.createLinearGradient(0, CEILING_Y, 0, WORLD_HEIGHT);
    g.addColorStop(0, '#8fd8ff');
    g.addColorStop(1, '#def4ff');
    this.ctx.fillStyle = g;
    this.ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
    this.cloudOffsets.forEach((offset, i) => {
      const x = ((offset - elapsed * CLOUD_SPEED * (0.7 + i * 0.1)) % (WORLD_WIDTH + 160)) - 80;
      const y = 120 + i * 100;
      this.drawCloud(x, y, 1 + i * 0.1);
    });

    this.ctx.fillStyle = 'rgba(255,255,255,0.35)';
    this.ctx.fillRect(0, WORLD_HEIGHT - GROUND_HEIGHT - 10, WORLD_WIDTH, 10);

    this.ctx.fillStyle = '#4dc16f';
    this.ctx.fillRect(0, WORLD_HEIGHT - GROUND_HEIGHT, WORLD_WIDTH, GROUND_HEIGHT);

    const stripeW = 36;
    const scroll = (elapsed * speed * GROUND_SCROLL_FACTOR) % stripeW;
    this.ctx.fillStyle = '#34a957';
    for (let x = -stripeW + scroll; x < WORLD_WIDTH; x += stripeW) {
      this.ctx.fillRect(x, WORLD_HEIGHT - GROUND_HEIGHT + 16, stripeW / 2, 12);
    }
  }

  private drawCloud(x: number, y: number, scale: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 24 * scale, 0, Math.PI * 2);
    this.ctx.arc(x + 24 * scale, y - 12 * scale, 20 * scale, 0, Math.PI * 2);
    this.ctx.arc(x + 48 * scale, y, 22 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawPipe(pipe: PipePair): void {
    const topHeight = pipe.gapY - pipe.gapSize / 2;
    const bottomY = pipe.gapY + pipe.gapSize / 2;
    const bottomHeight = WORLD_HEIGHT - GROUND_HEIGHT - bottomY;

    this.ctx.fillStyle = '#2eb658';
    this.ctx.fillRect(pipe.x, 0, pipe.width, topHeight);
    this.ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);

    this.ctx.fillStyle = '#49d874';
    this.ctx.fillRect(pipe.x + 8, 0, 12, topHeight);
    this.ctx.fillRect(pipe.x + 8, bottomY, 12, bottomHeight);

    this.ctx.fillStyle = '#229245';
    this.ctx.fillRect(pipe.x + pipe.width - 10, 0, 10, topHeight);
    this.ctx.fillRect(pipe.x + pipe.width - 10, bottomY, 10, bottomHeight);
  }

  private drawPlayer(player: Player): void {
    this.ctx.save();
    this.ctx.translate(player.position.x, player.position.y);
    this.ctx.rotate(player.rotation);

    this.ctx.fillStyle = '#ffd6a5';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, player.radius, player.radius * 0.95, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#f39f42';
    this.ctx.beginPath();
    this.ctx.moveTo(-20, -16);
    this.ctx.quadraticCurveTo(8, -38, 28, -14);
    this.ctx.quadraticCurveTo(6, -20, -16, -4);
    this.ctx.fill();

    this.ctx.fillStyle = '#1c2a3a';
    this.ctx.beginPath();
    this.ctx.arc(-8, -4, 3.5, 0, Math.PI * 2);
    this.ctx.arc(11, -4, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#1c2a3a';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(-16, 14);
    this.ctx.quadraticCurveTo(0, 22, 18, 13);
    this.ctx.stroke();

    this.ctx.fillStyle = '#dd7840';
    this.ctx.beginPath();
    this.ctx.moveTo(5, 3);
    this.ctx.lineTo(15, 6);
    this.ctx.lineTo(6, 10);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawParticle(particle: Particle): void {
    const alpha = particle.life / particle.maxLife;
    this.ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.position.x, particle.position.y, particle.size * alpha, 0, Math.PI * 2);
    this.ctx.fill();
  }

  resize(canvas: HTMLCanvasElement): void {
    const ratio = Math.min(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT);
    const width = Math.floor(WORLD_WIDTH * ratio);
    const height = Math.floor(WORLD_HEIGHT * ratio);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = WORLD_WIDTH;
    canvas.height = WORLD_HEIGHT;

    Object.assign(canvas.style, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    });
  }
}
