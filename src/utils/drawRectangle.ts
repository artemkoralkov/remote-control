import { getMousePos, mouseToggle, moveMouseSmooth } from "robotjs";
export function drawRectangle(width: number, length: number): void {
  let { x, y } = getMousePos();
  mouseToggle("down");
  x += width;
  moveMouseSmooth(x, y);
  y += length;
  moveMouseSmooth(x, y);
  x -= width;
  moveMouseSmooth(x, y);
  y -= length;
  moveMouseSmooth(x, y);
  mouseToggle("up");
}
