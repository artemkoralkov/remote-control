import { getMousePos, mouseToggle, moveMouse } from "robotjs";

export function drawCircle(radius: number) {
  const mousePos = getMousePos();

  for (let i = 0; i <= Math.PI * 2; i += 0.05) {
    // Convert polar coordinates to cartesian
    const x = mousePos.x + radius * Math.cos(i);
    const y = mousePos.y + radius * Math.sin(i);

    moveMouse(x, y);
    mouseToggle("down");
  }
  mouseToggle("up");
}
