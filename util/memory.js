class myMemory {
    constructor() {
        this.memory = {};
    }

    createMemory(id) {
        this.memory[id] = {
            socket: null,
            ip: null,
            port: null,
        };
    }

    deleteMemory(id) {
        delete this.memory[id];
    }

    send(id, msg) {
        if (this.memory[id].socket !== null) {
            this.memory[id].socket.write(msg);
        }
    }

    setSocket(id, socket) {
        this.memory[id].socket = socket;
    }

    setIpnPort(id, ip, port) {
        this.memory[id].ip = ip;
        this.memory[id].port = port;
    }

    getIP(id) {
        return this.memory[id].ip;
    }

    getPort(id) {
        return this.memory[id].port;
    }

    getSocket(id) {
        if (this.memory[id].socket !== null) {
            return this.memory[id].socket;
        } else {
            console.log("소켓이 존재하지 않음..");
        }
    }
}

const memory = new myMemory();
export default memory;
