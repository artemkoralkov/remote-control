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
    let scrn;
    switch (command) {
      case "mouse_position":
        duplex.write(`mouse_position ${x},${y} \0`);
        console.log(`Send: mouse_position ${x},${y}`);
        break;
      case "mouse_up":
        duplex.write(`${command} \0`);
        robot.moveMouseSmooth(x, y - parseInt(length));
        console.log(`Moved mouse to ${length}px up`);
        break;
      case "mouse_down":
        duplex.write(`${command} \0`);
        robot.moveMouseSmooth(x, y + parseInt(length));
        console.log(`Moved mouse to ${length}px down`);
        break;
      case "mouse_left":
        duplex.write(`${command} \0`);
        robot.moveMouseSmooth(x - parseInt(length), y);
        console.log(`Moved mouse to ${length}px left`);
        break;
      case "mouse_right":
        duplex.write(`${command} \0`);
        robot.moveMouseSmooth(x + parseInt(length), y);
        console.log(`Moved mouse to ${length}px right`);
        break;
      case "draw_rectangle":
        duplex.write(`${command} \0`);
        drawRectangle(parseInt(width), parseInt(length));
        console.log(`Draw ${width}px by ${length}px rectangle`);
        break;
      case "draw_square":
        duplex.write(`${command} \0`);
        drawSquare(parseInt(length));
        console.log(`Draw ${length}px square`);
        break;
      case "draw_circle":
        duplex.write(`${command} \0`);
        drawCircle(parseInt(length));
        console.log(`Draw circle with ${length}px radius`);
        break;
      case "prnt_scrn":
        scrn = await printScreen();
        duplex.write(`${scrn} \0`);
        console.log(`Send: ${scrn}`);
        break;
      default:
        duplex.write("Invalid command");
        console.log("Invalid command");
        break;
    }
  });
  ws.on("close", () => {
    duplex.destroy();
    console.log("Connection close");
  });
  wss.on("close", () => {
    duplex.destroy();
    console.log("WebSocketServer stoped");
  });
});

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
