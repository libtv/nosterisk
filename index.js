import net from "net";
import methodRouter from "./router/router";
import { bytes2str } from "./util/string";

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

server.listen(9999);
