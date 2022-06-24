import Jimp from "jimp";
import { WebSocket } from "ws";
import { Bitmap, getMousePos, screen } from "robotjs";

export function printScreen(ws: WebSocket) {
  const { x, y } = getMousePos();
  const img = screen.capture(x, y, 200, 200);
  const data: Bitmap["image"][] = [];
  const bitmap: Bitmap["image"] = img.image;

  for (let i = 0; i < bitmap.length; i += 4) {
    data.push(bitmap[i + 2], bitmap[i + 1], bitmap[i], bitmap[i + 3]);
  }
  new Jimp(
    {
      data: new Uint8Array(data),
      width: img.width,
      height: img.height,
    },
    (error: Error, image: Jimp) => {
      image.getBase64Async(Jimp.MIME_PNG).then((v) => {
        ws.send(`prnt_scrn ${v.split(",")[1]}`);
      });
    }
  );
}
