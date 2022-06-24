import { getMousePos, mouseToggle, moveMouseSmooth } from "robotjs";
export function drawSquare(length: number): void {
  let { x, y } = getMousePos();
  mouseToggle("down");
  x += length;
  moveMouseSmooth(x, y);
  y += length;
  moveMouseSmooth(x, y);
  x -= length;
  moveMouseSmooth(x, y);
  y -= length;
  moveMouseSmooth(x, y);
  mouseToggle("up");
}
