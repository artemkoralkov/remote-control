// import Jimp from 'jimp';
import { httpServer } from "./src/http_server/index";
import robot from "robotjs";
import { createWebSocketStream, WebSocketServer } from "ws";
import {
  drawCircle,
  drawRectangle,
  drawSquare,
  printScreen,
} from "./src/utils";

const HTTP_PORT = 3000;
const wss = new WebSocketServer({ port: 8080 });
wss.on("listening", () => {
  console.log(`WebSocketServer running on port ${wss.options.port}`);
});
wss.on("connection", (ws) => {
  const duplex = createWebSocketStream(ws, {
    encoding: "utf8",
    decodeStrings: false,
  });
  console.log("Connection open");
  duplex.on("data", async (data) => {
    const [command, length, width] = data.toString().split(" ");
    console.log(`Received ${data}`);
    const { x, y } = robot.getMousePos();
    switch (command) {
      case "mouse_position":
        duplex.write(`mouse_position ${x},${y}`);
        console.log(`Send: mouse_position ${x},${y}`);
        break;
      case "mouse_up":
        duplex.write("mouse_up");
        robot.moveMouseSmooth(x, y - parseInt(length));
        break;
      case "mouse_down":
        duplex.write("mouse_down");
        robot.moveMouseSmooth(x, y + parseInt(length));
        break;
      case "mouse_left":
        duplex.write("mouse_left");
        robot.moveMouseSmooth(x - parseInt(length), y);
        break;
      case "mouse_right":
        duplex.write("mouse_right");
        robot.moveMouseSmooth(x + parseInt(length), y);
        break;
      case "draw_rectangle":
        duplex.write("draw_rectangle");
        drawRectangle(parseInt(width), parseInt(length));
        break;
      case "draw_square":
        duplex.write("draw_square");
        drawSquare(parseInt(length));
        break;
      case "draw_circle":
        duplex.write("draw_circle");
        drawCircle(parseInt(length));
        break;
      case "prnt_scrn":
        duplex.write(await printScreen());
        console.log(`Send: ${await printScreen()}`);
        break;
    }
  });
  ws.on("close", () => {
    console.log("Connection close");
  });
});

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
