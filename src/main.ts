import './style.css'

import Params from "./params.ts"
import { canvasToImage, createAreaCanvas, createCanvas, imageToCanvas, loadImage } from './canvas.ts';
import { drawArea, drawBackgrounds } from './pixels.ts';
import { paste } from './perspective.ts';
import { Font } from './text.ts';

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

async function main() {
  const [c, ctx] = createCanvas(params.renderArea);
  document.body.appendChild(c);

  drawBackgrounds(ctx, params.background)

  const a = params.areas.lines;
  const [areaCanvas, areaCtx] = createAreaCanvas(a);
  document.body.appendChild(areaCanvas);
  const font = await Font.load(a.font, a.characterSize);
  font.drawLines(areaCtx, [0, 0], ["meow", "hehehehe :3"])

  const data = areaCtx.getImageData(0, 0, areaCanvas.width, areaCanvas.height);
  const getValue = ([x, y]: [number, number]): boolean => {
    const red = y * areaCanvas.width * 4 + x * 4;
    console.log(x, y, data.data[red])
    return data.data[red] < 255;
  }

  drawArea(ctx, params.areas.lines, getValue);

  const targetImage = await loadImage(params.image);
  const [target, targetCtx] = imageToCanvas(targetImage);

  paste(targetCtx, c, params.drawArea);
  document.body.appendChild(target);
}

main();


