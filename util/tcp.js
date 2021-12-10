import net from "net";

export function sendMsg(ip, port, msg) {
    const client = net.connect({ port: port, host: ip });
    client.write(msg);
    client.end();
}
