import './style.css'

import Params from "./params.ts"
import { createCanvas } from './canvas.ts';
import { drawArea, drawBackgrounds } from './pixels.ts';

const params: Params = {
  image: "base.png",
  size: [1002, 794],

  renderArea: [640, 480],

  drawArea: {
    topLeft: [276, 172],
    topRight: [880, 189],
    bottomRight: [893, 620],
    bottomLeft: [276, 172 + 441],
  },

  background: [
    { box: [0, 0, 640, 480], color: "#1F110C" },
    { box: [0, 16, 640, 44], color: "#2E0B03" },
    { box: [0, 16 + 58, 640, 44], color: "#2E0B03" },
    { box: [0, 16 + 58 * 2, 640, 44], color: "#2E0B03" },
    { box: [0, 16 + 58 * 3, 640, 44], color: "#2E0B03" },
    { box: [0, 16 + 58 * 4, 640, 44], color: "#2E0B03" },
    { box: [0, 16 + 58 * 5, 640, 44], color: "#2E0B03" },
    { box: [0, 16 + 58 * 6, 640, 44], color: "#2E0B03" },
    { box: [0, 16 + 58 * 7, 640, 44], color: "#2E0B03" },
  ],

  areas: {
    lines: {
      start: [4.5, 18],
      size: [20, 8],
      characterSize: [5, 8],
      pxSpacing: [4.6, 5],
      pxSize: 4.6,
      characterSpacing: [9, 18],
      font: 'font.png',
      on: '#EAB777',
      off: '#441F1C',
    },
    // and more
  },
}



const [c, ctx] = createCanvas(params.renderArea);
document.body.appendChild(c);

drawBackgrounds(ctx, params.background)
drawArea(ctx, params.areas.lines, ([x, y]) => (x + y) % 3 == 0)
