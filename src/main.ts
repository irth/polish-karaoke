import './style.css'

import Params from "./params.ts"
import { createAreaCanvas, createCanvas, imageToCanvas, loadImage } from './canvas.ts';
import { drawArea, drawBackgrounds } from './pixels.ts';
import { paste } from './perspective.ts';
import { Font } from './text.ts';

const screens: { [key: string]: Params } = {};

async function loadScreen(name: string): Promise<Params> {
  const base = `screens/${name}`
  const specReq = await fetch(`${base}/spec.json`);
  const spec = await specReq.json();
  spec._base = base;
  return spec;
}

async function render(params: Params, text: { [area: string]: string[] }): Promise<string> {
  const [c, ctx] = createCanvas(params.renderArea);
  document.body.appendChild(c); // DEBUG

  drawBackgrounds(ctx, params)

  for (let [name, area] of Object.entries(params.areas)) {
    const [areaCanvas, areaCtx] = createAreaCanvas(area);
    document.body.appendChild(areaCanvas); // DEBUG
    const font = await Font.load(params._base, area.font);
    font.drawLines(areaCtx, [0, 0], text[name] || [], true);

    const data = areaCtx.getImageData(0, 0, areaCanvas.width, areaCanvas.height);
    const getValue = ([x, y]: [number, number]): boolean => {
      const red = y * areaCanvas.width * 4 + x * 4;
      return data.data[red] < 255;
    }

    drawArea(ctx, params, area, getValue);
  }
  const targetImage = await loadImage(`${params._base}/${params.image}`);
  const [target, targetCtx] = imageToCanvas(targetImage);

  paste(targetCtx, c, params.drawArea);
  document.body.appendChild(target); // DEBUG

  return c.toDataURL();
}

async function main() {
  const mpk = await loadScreen('mpk');
  const crt20 = await loadScreen('crt20');

  render(mpk, { rozklad: ["    69  NIGDZIE                           13 min", "", "", "", "", "wroc.pl###JAKOŚĆ POWIETRZA: UMIARKOWANA"] })
  render(crt20, { lines: ["meow", "hehe"] })
}

main();


