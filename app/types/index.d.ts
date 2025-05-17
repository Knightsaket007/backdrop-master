declare type Sticker={
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
}

declare type TextItem ={
  id: number;
  content: string;
  fontFamily: string;
  size: string;
  bold: boolean;
  italic: boolean;
  color: string;
  top?: string;
  left?: string;
  rotate?: number;
  width?: string;
  height?: string;
  shadow?: (string | number)[];
  hasShadow?: boolean;
  textImage?: string;
  gradient: (string | number)[];
  isgradient: boolean;
}


declare type EditorPayload={
  userId: string;
  plan: string;
  editorId: string;
  backgroundImage: string | null;
  bgremovedImage?: string;
  imgWidth: number;
  imgHeight: number;
  brushColor?: string;
  brushSize?: number;
  showFilters?: string;
  colorArray?: string[];
  texts?: TextItem[];
  stickers?: Sticker[];
}