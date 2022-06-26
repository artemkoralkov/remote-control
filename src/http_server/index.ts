import * as fs from "fs";
import * as path from "path";
import * as http from "http";

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(""));
  const file_path =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
  const front = fs.createReadStream(file_path);
  res.writeHead(200);
  front.pipe(res);
  front.on("error", (error) => {
    res.writeHead(404);
    res.end(JSON.stringify(error));
    return;
  });
});
