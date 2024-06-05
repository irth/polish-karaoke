import { loadImage } from "./canvas";

type Characters = { [ch: string]: number }

export class Font {
  img: HTMLImageElement
  chW: number
  chH: number
  chs: Characters

  constructor(img: HTMLImageElement, [characterWidth, characterHeight]: [number, number], characters: Characters) {
    this.img = img;
    this.chW = characterWidth;
    this.chH = characterHeight;
    this.chs = characters;
  }

  static async load(fontPath: string, [characterWidth, characterHeight]: [number, number]) {
    const fontSpecReq = await fetch(`${fontPath}.txt`);
    const fontSpec = await fontSpecReq.text();

    const img = await loadImage(fontPath);

    const characters = [...fontSpec].reduce((d, ch, idx) => (
      ch.trim().length == 0 ? d : {
        ...d,
        [ch]: (idx - 0) * (characterWidth + 1)
      }
    ), {})

    return new Font(img, [characterWidth, characterHeight], characters)
  }

  drawCharacter(ctx: CanvasRenderingContext2D, [x, y]: [number, number], ch: string, ignoreUnknown: boolean = false) {
    const charX = this.chs[ch] || this.chs[ch.toUpperCase()];
    if (charX == null) {
      if (ignoreUnknown || ch == ' ') return;
      throw Error(`unknown character: ${ch}`);
    };

    ctx.drawImage(this.img, charX, 0, this.chW, this.chH, x, y, this.chW, this.chH);
  }

  drawLine(ctx: CanvasRenderingContext2D, [x, y]: [number, number], line: string, ignoreUnknown: boolean = false) {
    const yy = y * this.chH;
    [...line].forEach((ch, idx) => {
      this.drawCharacter(ctx, [(x + idx) * this.chW, yy], ch, ignoreUnknown);
    })
  }


  drawLines(ctx: CanvasRenderingContext2D, [x, y]: [number, number], lines: string[], ignoreUnknown: boolean = false) {
    lines.forEach((line, lineIdx) => {
      this.drawLine(ctx, [x, y + lineIdx], line, ignoreUnknown)
    })
  }
}
