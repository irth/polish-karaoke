import './style.css'

import Params from "./params.ts"
import { createAreaCanvas, createCanvas, imageToCanvas, loadImage } from './canvas.ts';
import { drawArea, drawBackgrounds } from './pixels.ts';
import { paste } from './perspective.ts';
import { Font } from './text.ts';

async function loadScreen(name: string): Promise<Params> {
  const base = `screens/${name}`
  const specReq = await fetch(`${base}/spec.json`);
  const spec = await specReq.json();
  spec._base = base;
  return spec;
}

async function render(params: Params, text: { [drawingArea: string]: { [textArea: string]: string[] } }): Promise<string> {
  const [c, ctx] = createCanvas(params.renderArea);
  document.body.appendChild(c); // DEBUG

  drawBackgrounds(ctx, params)


  for (let [name, area] of Object.entries(params.areas)) {
    const [areaCanvas, areaCtx] = createAreaCanvas(area);
    document.body.appendChild(areaCanvas); // DEBUG

    for (let [textAreaName, textArea] of Object.entries(area.text)) {
      console.log(textAreaName);
      const lines = (text[name] ?? {})[textAreaName];
      if (lines == null) continue;

      const font = await Font.load(params._base, textArea.font);

      const align = textArea.align ?? 'left';

      const [textAreaCanvas, textAreaCtx] = createAreaCanvas(textArea);
      document.body.appendChild(textAreaCanvas) // DEBUG

      console.log(align, textArea);
      font.drawLines(textAreaCtx, [0, 0], lines, true, align, textArea.size[0]);
      areaCtx.drawImage(textAreaCanvas, ...textArea.start);
    }


    const data = areaCtx.getImageData(0, 0, areaCanvas.width, areaCanvas.height);
    const getValue = ([x, y]: [number, number]): boolean => {
      const red = y * areaCanvas.width * 4 + x * 4;
      return data.data[red] < 255;
    }

    drawArea(ctx, params, area, getValue);
  }
  const targetImage = await loadImage(`${params._base}/${params.image}`);
  const [target, targetCtx] = imageToCanvas(targetImage);

  paste(targetCtx, c, params.perspective);
  document.body.appendChild(target); // DEBUG

  return c.toDataURL();
}

async function main() {
  const mpk = await loadScreen('mpk');
  const crt20 = await loadScreen('crt20');

  render(mpk, {
    rozklad: {
      linia: ["149", "122", "103", "106", "107"],
      kierunek: ["KUŹNIKI", "NOWY DWÓR PĘTLA", "PRACZE ODRZAŃSKIE", "PORT LOTNICZY", "KRZYKI"],
      odjazd: ["15:18", "15:19", "15:22", "15:23", "15:24"],
      info: ["a pl. Orląt Lwowskich. Zmiany na lin"]
    }
  })
  render(crt20, { lines: { song: ["meow", "hehe"] } })
}

main();


