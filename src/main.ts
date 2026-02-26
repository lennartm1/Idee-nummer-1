import './style.css';
import { GameLoop } from './engine/loop';
import { InputHandler } from './engine/input';
import { FlumpyTrumpGame } from './game/game';
import { Renderer } from './game/renderer';
import { OverlayUi } from './ui/overlay';

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
const uiRoot = document.querySelector<HTMLElement>('#ui-layer');

if (!canvas || !uiRoot) {
  throw new Error('Canvas/UI root niet gevonden.');
}

const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Canvas context niet beschikbaar.');
}

const renderer = new Renderer(ctx);
const input = new InputHandler(window);
const ui = new OverlayUi(uiRoot);
const game = new FlumpyTrumpGame(renderer, input, ui);

input.mount();
renderer.resize(canvas);

const loop = new GameLoop((dt) => {
  game.update(dt);
  game.render();
});

window.addEventListener('resize', () => game.resize(canvas));
loop.start();
