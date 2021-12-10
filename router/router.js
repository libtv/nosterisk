import { INVITE, OK200, REGISTER, RINGING } from "../const/const.js";
import { parser } from "../util/sip-parser.js";
import { forwardInvite, forwardOk, forwardRinging, OK_200, TRYING_100 } from "../util/sip-response.js";
import { bytes2str } from "../util/string.js";
import { sendMsg } from "../util/tcp.js";
import memory from "../util/memory.js";

async function methodRouter(chunk, socket) {
    try {
        let requestBody = bytes2str(chunk);
        let [parserobj, parserobj2, sdp] = parser(requestBody);
        let callee, caller;

        switch (parserobj.m.method) {
            case REGISTER:
                socket.write(OK_200(parserobj));
                memory.createMemory(parserobj.from_id);
                memory.setSocket(parserobj.from_id, socket);
                memory.setIpnPort(parserobj.from_id, parserobj.contact_host.ip, parserobj.contact_host.port);
                break;

            case INVITE:
                callee = parserobj.to_id;
                caller = parserobj.from_id;

                memory.send(caller, TRYING_100(parserobj));
                memory.send(callee, forwardInvite(parserobj, parserobj2, sdp));
                break;

            case RINGING:
                callee = parserobj.to_id;
                caller = parserobj.from_id;

                // memory.send(caller, forwardRinging(parserobj));
                break;

            case OK200:
                callee = parserobj.to_id;
                caller = parserobj.from_id;
                memory.send(caller, forwardOk(parserobj, parserobj2, sdp));
                break;

            default:
                break;
        }
    } catch (err) {}
}

export default methodRouter;
