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

  getCharacter(ch: string): CharacterSpec | null {
    const chSpec = this.chs[ch] || this.chs[ch.toUpperCase()];
    return chSpec;
  }

  getCharacterOffset(ch: string) {
    const chSpec = this.getCharacter(ch) ?? { w: 5 };
    return chSpec.w;
  }

  drawCharacter(ctx: CanvasRenderingContext2D, [x, y]: [number, number], ch: string, ignoreUnknown: boolean = false): number {
    const chSpec = this.getCharacter(ch);
    const offset = this.getCharacterOffset(ch);
    if (chSpec == null) {
      if (ignoreUnknown || ch == ' ') return offset;
      throw Error(`unknown character: ${ch}`);
    };

    ctx.drawImage(this.img, chSpec.x, 0, chSpec.w, this.height, x, y, chSpec.w, this.height);
    return offset;
  }


  drawLine(ctx: CanvasRenderingContext2D, [x, y]: [number, number], line: string, ignoreUnknown: boolean = false, align: 'left' | 'center' | 'right' = 'left', containerWidth?: number) {
    if (align != 'left') {
      if (containerWidth == null) {
        throw Error("can't align text without known containerWidth");
      }

      const lineWidth = [...line].reduce((prev, cur) => prev + this.getCharacterOffset(cur), 0);

      if (align == 'center') {
        x += Math.floor((containerWidth - lineWidth) / 2);
      } else if (align == 'right') {
        x += containerWidth - lineWidth;
      }
    }


    const yy = y * this.height;
    [...line].forEach(ch => {
      x += this.drawCharacter(ctx, [x, yy], ch, ignoreUnknown);
    })
  }


  drawLines(ctx: CanvasRenderingContext2D, [x, y]: [number, number], lines: string[], ignoreUnknown: boolean = false, align: 'left' | 'center' | 'right' = 'left', containerWidth?: number) {
    lines.forEach((line, lineIdx) => {
      this.drawLine(ctx, [x, y + lineIdx], line, ignoreUnknown, align, containerWidth)
    })
  }
}
