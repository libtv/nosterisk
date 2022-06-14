import net from "net";
import methodRouter from "./router/router.js";
import { bytes2str } from "./util/string.js";

let server = net.createServer((socket) => {
    socket.on("data", (chunk) => {
        methodRouter(chunk, socket);
    });

    socket.on("end", function () {
        console.log("클라이언트 접속 종료");
    });

    server.on("listening", function () {
        console.log("Server is listening");
    });
});

server.listen(7777);
