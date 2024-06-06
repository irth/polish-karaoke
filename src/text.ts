import { loadImage } from "./canvas";

type CharacterSpec = { x: number, w: number }
type Characters = { [ch: string]: CharacterSpec }

type FontSpec = {
  image: string,
  height: number,
  characters: Characters,
}

export class Font {
  img: HTMLImageElement
  height: number
  chs: Characters

  constructor(img: HTMLImageElement, height: number, characters: Characters) {
    this.img = img;
    this.height = height;
    this.chs = characters;
  }

  static async load(base: string, name: string) {
    const fontSpecTxt = await fetch(`${base}/${name}.json`);
    const fontSpec: FontSpec = await fontSpecTxt.json();
    // could check if fontSpec is actualy FontSpec but CBA

    const img = await loadImage(`${base}/${fontSpec.image}`);
    return new Font(img, fontSpec.height, fontSpec.characters)
  }

  drawCharacter(ctx: CanvasRenderingContext2D, [x, y]: [number, number], ch: string, ignoreUnknown: boolean = false): number {
    const chSpec = this.chs[ch] || this.chs[ch.toUpperCase()];
    if (chSpec == null) {
      if (ignoreUnknown || ch == ' ') return 5;
      throw Error(`unknown character: ${ch}`);
    };

    ctx.drawImage(this.img, chSpec.x, 0, chSpec.w, this.height, x, y, chSpec.w, this.height);
    return chSpec.w
  }

  drawLine(ctx: CanvasRenderingContext2D, [x, y]: [number, number], line: string, ignoreUnknown: boolean = false) {
    const yy = y * this.height;
    [...line].forEach(ch => {
      x += this.drawCharacter(ctx, [x, yy], ch, ignoreUnknown);
    })
  }


  drawLines(ctx: CanvasRenderingContext2D, [x, y]: [number, number], lines: string[], ignoreUnknown: boolean = false) {
    lines.forEach((line, lineIdx) => {
      this.drawLine(ctx, [x, y + lineIdx], line, ignoreUnknown)
    })
  }
}
