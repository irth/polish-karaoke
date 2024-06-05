export type Background = {
  box: [number, number, number, number];
  color: string;
};

export type Area = {
  start: [number, number];
  size: [number, number];
  characterSize: [number, number];
  pxSpacing: [number, number];
  pxSize: number;
  characterSpacing: [number, number];
  font: string;
  on: string;
  off: string;
};

type Params = {
  image: string;
  size: [number, number];

  renderArea: [number, number];

  drawArea: {
    topLeft: [number, number];
    topRight: [number, number];
    bottomRight: [number, number];
    bottomLeft: [number, number];
  };

  background: Background[];

  areas: {
    [key: string]: Area;
  };
}

export default Params;
