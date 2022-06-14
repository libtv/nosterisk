import { ALLOW, ALLOWEVENTS, CALLID, CONTACT, CONTENT_LENGTH, CONTENT_TYPE, CSEQ, EXPIRES, FROM, MAXFORWARDS, METHOD, NEWLINE, SEPARATOR, TO, USERAGENT, VIA } from "../const/const.js";
import _ from "lodash";

export function parser(requestBody) {
    let [sip, sdp] = requestBody.split(SEPARATOR);

    let sipobj = split2sip(sip);
    let parserobj = sip
        ? {
              m: method(sipobj[METHOD]),
              via: sipobj[VIA],
              to: sipobj[TO],
              from: sipobj[FROM],
              callId: sipobj[CALLID],
              cseq: sipobj[CSEQ],
              contact: sipobj[CONTACT],
              contentType: sipobj[CONTENT_TYPE],
              contentLength: sipobj[CONTENT_LENGTH],
              maxforwards: sipobj[MAXFORWARDS],
              expires: sipobj[EXPIRES],
              allow: sipobj[ALLOW],
              useragent: sipobj[USERAGENT],
              allowevents: sipobj[ALLOWEVENTS],

              from_id: getID(sipobj[FROM]),
              to_id: getID(sipobj[TO]),

              from_host: getIPnPort(sipobj[FROM]),
              to_host: getIPnPort(sipobj[TO]),
              contact_host: getIPnPort(sipobj[CONTACT]),
          }
        : "";

    let sdpobj = sdp ? split2sdp(sdp) : null;
    let parserobj2 = sdp
        ? {
              v: sdpobj.v,
              o: sdpobj.o,
              s: sdpobj.s,
              c: sdpobj.c,
              t: sdpobj.t,
              m: sdpobj.m,
              a: sdpobj.a,
          }
        : "";

    return [parserobj, parserobj2, sdp];
}

function split2sip(sip) {
    let split = sip.split(NEWLINE);
    let obj = { Via: [] };
    split.map((line, idx) => {
        if (idx === 0) {
            obj["method"] = line;
        } else {
            let [key, value] = line.split(": ");
            if (key === VIA) {
                obj[key].push(value);
            } else {
                obj[key] = value;
            }
        }
    });
    return obj;
}

function split2sdp(sdp) {
    let split = sdp.split(NEWLINE);
    let obj = {
        a: [],
    };
    split.map((line, idx) => {
        let [key, value] = line.split("=");
        if (key === "a") {
            obj[key].push(value);
        } else {
            obj[key] = value;
        }
    });
    return obj;
}

//* parser main //

function method(line) {
    let m = "";
    let u = "";
    let v = "";

    m = line.replace(/(SIP|sip)+[\:\,\w\@\;\=\/\.]+/g, "").trim();
    u = line.match(/[sip]+[\:\,\w\@\;\=\/\.]+/g) ? line.match(/[sip]+[\:\,\w\@\;\=\/\.]+/g)[0] : "";
    v = line.match(/[SIP/]+[\/\d\.]+/g) ? line.match(/[SIP/]+[\/\d\.]+/g)[0] : "";

    let obj = {
        method: m,
        url: u,
        version: v,
    };

    return obj;
}

function getID(line) {
    return line.slice(line.indexOf(":") + 1, line.indexOf("@"));
}

function getIPnPort(line) {
    let ipnPort = line
        .match(/@+[\d\w\.]+:[\d]+/g)[0]
        .replace("@", "")
        .split(":");
    let obj = {
        ip: ipnPort[0],
        port: ipnPort[1],
    };

    return obj;
}
