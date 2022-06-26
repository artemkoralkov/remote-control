import Jimp from "jimp";
import { Bitmap, getMousePos, screen } from "robotjs";

export async function printScreen() {
  const { x, y } = getMousePos();
  const img = screen.capture(x, y, 200, 200);
  const data: Bitmap["image"][] = [];
  const bitmap: Bitmap["image"] = img.image;

  for (let i = 0; i < bitmap.length; i += 4) {
    data.push(bitmap[i + 2], bitmap[i + 1], bitmap[i], bitmap[i + 3]);
  }
  const image = new Jimp({
    data: new Uint8Array(data),
    width: img.width,
    height: img.height,
  });

  return `prnt_scrn ${
    (await image.getBase64Async(Jimp.MIME_PNG)).split(",")[1]
  }`;
}
