import './style.css'

import Params from "./params.ts"
import { createAreaCanvas, createCanvas, imageToCanvas, loadImage } from './canvas.ts';
import { drawArea, drawBackgrounds } from './pixels.ts';
import { paste } from './perspective.ts';
import { Font } from './text.ts';

const mpkBg = "#21201d"
const screens: { [key: string]: Params } = {
  crt20: {
    image: "screens/crt20.png",

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
        size: [100, 64],
        cluster: {
          size: [5, 8],
          spacing: [9, 18],
        },
        pxSpacing: [4.6, 5],
        pxSize: 4.6,
        font: 'fonts/crt20.json',
        on: '#EAB777',
        off: '#441F1C',
      },
    },
  },
  mpk: {
    image: "screens/mpk.png",

    renderArea: [640, 412],

    drawArea: {
      topLeft: [384, 163],
      topRight: [921, 23],
      bottomRight: [965, 388],
      bottomLeft: [381, 508],
    },

    background: [
      { box: [0, 0, 640, 87], color: mpkBg },
      { box: [0, 127, 640, 285], color: mpkBg },
    ],

    areas: {
      rozklad: {
        start: [4, 127],
        size: [144, 65],
        pxSpacing: [4.4, 4.4],
        pxSize: 3.5,
        font: 'fonts/mpk_rozklad.json',
        on: '#f0973a',
        off: '#31302d',
      }
    },
  }
}


async function render(params: Params, text: { [area: string]: string[] }): Promise<string> {
  const [c, ctx] = createCanvas(params.renderArea);
  document.body.appendChild(c); // DEBUG

  drawBackgrounds(ctx, params.background)

  for (let [name, area] of Object.entries(params.areas)) {
    const [areaCanvas, areaCtx] = createAreaCanvas(area);
    document.body.appendChild(areaCanvas); // DEBUG
    const font = await Font.load(area.font);
    font.drawLines(areaCtx, [0, 0], text[name] || [], true);

    const data = areaCtx.getImageData(0, 0, areaCanvas.width, areaCanvas.height);
    const getValue = ([x, y]: [number, number]): boolean => {
      const red = y * areaCanvas.width * 4 + x * 4;
      return data.data[red] < 255;
    }

    drawArea(ctx, area, getValue);
  }
  const targetImage = await loadImage(params.image);
  const [target, targetCtx] = imageToCanvas(targetImage);

  paste(targetCtx, c, params.drawArea);
  document.body.appendChild(target); // DEBUG

  return c.toDataURL();
}

async function main() {
  render(screens.mpk, { rozklad: ["    69  NIGDZIE                           13 min", "", "", "", "", "wroc.pl###JAKOŚĆ POWIETRZA: UMIARKOWANA"] })
}

main();


