
interface CommonShape {
  x: number;
  y: number;
  zIndex: number;
  // 标记当前图像的位置
  pathIndex?: number;
  centerX?: number;
  centerY?: number;
  rotateDeg: number;
  shapePath: Path2D;
  controlPathList: Path2D[];
}
export interface RectShape extends CommonShape {
  type: 'rect';
  w: number;
  h: number;
  fillStyle: string;
}
export interface CircleShape extends CommonShape {
  type: 'circle';
  r: number;
  fillStyle: string;
}
export interface ImageShape extends CommonShape{
  type: 'image';
  src: string;
  w: number;
  h: number;
}
export enum Directions {
  northWestern='nw-resize',
  northEstern='ne-resize',
  southEstern='se-resize',
  southWest='sw-resize',
  crosshair='crosshair',
  move='move'
}
// export type Shape = RectShape | CircleShape 
export type Shape = RectShape
export type Direction = Directions.northWestern | Directions.northEstern | Directions.southEstern| Directions.southWest | 'default' | Directions.crosshair | Directions.move

export type Boundary = { minX: number; minY: number } | { minX: number; maxY: number } | { maxX: number; minY: number } | { maxX: number; maxY: number }
export interface XYPosition {
  x: number;
  y: number;
}
export interface MouseDown extends XYPosition {
  diffX: number;
  diffY: number;
}
export type DobuleNumber = [number,number]

export interface Path{
  path: Path2D;
  zIndex: number;
}
export interface RectTranslate {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  startX: number;
  startY: number;
  fillStyle: string;
  w: number;
  h: number;
}