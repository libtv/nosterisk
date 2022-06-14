import { ALLOW, ALLOWEVENTS, CALLID, CONTACT, CONTENT_LENGTH, CSEQ, EXPIRES, FROM, MAXFORWARDS, TO, USERAGENT, VIA } from "../const/const.js";

export function OK_200(parserobj) {
    let ok_res = "SIP/2.0 200 OK\r\n";

    parserobj.via.map((via) => {
        ok_res = ok_res + "Via: " + via + "\r\n";
    });

    ok_res = ok_res + "From: " + parserobj.from + "\r\n";
    ok_res = ok_res + "To: " + parserobj.to + "\r\n";
    ok_res = ok_res + "Call-ID: " + parserobj.callId + "\r\n";
    ok_res = ok_res + "CSeq: " + parserobj.cseq + "\r\n";
    ok_res = ok_res + "Contact: " + parserobj.contact + "\r\n";
    ok_res = ok_res + "Allow: " + parserobj.allow + "\r\n";
    ok_res = ok_res + "Max-Forwards: " + parserobj.maxforwards + "\r\n";
    ok_res = ok_res + "Allow-Events: " + parserobj.allowevents + "\r\n";
    ok_res = ok_res + "User-Agent: " + parserobj.useragent + "\r\n";
    ok_res = ok_res + "Expires: " + parserobj.expires + "\r\n";
    ok_res = ok_res + "Content-Length: " + parserobj.contentLength + "\r\n";

    ok_res = ok_res + "\r\n";
    return ok_res;
}

export function TRYING_100(parserobj) {
    let trying_res = "SIP/2.0 100 Trying\r\n";

    parserobj.via.map((via, idx) => {
        if (idx === 0) {
            let upperViaFeild = via;
            let recieved = upperViaFeild.substring(via.indexOf(" ") + 1, via.indexOf(":"));
            upperViaFeild = upperViaFeild + ";recieved=" + recieved;

            let rport = upperViaFeild.match(/:+[\d]+;+/g)[0];
            rport = rport.slice(1, rport.length - 1);
            upperViaFeild = upperViaFeild.replace(/rport/gi, "rport=" + rport);

            trying_res = trying_res + "Via: " + upperViaFeild + "\r\n";
        } else {
            trying_res = trying_res + "Via: " + via + "\r\n";
        }
    });

    trying_res = trying_res + "From: " + parserobj.from + "\r\n";
    trying_res = trying_res + "To: " + parserobj.to + "\r\n";
    trying_res = trying_res + "Call-ID: " + parserobj.callId + "\r\n";
    trying_res = trying_res + "CSeq: " + parserobj.cseq + "\r\n";
    trying_res = trying_res + "Allow: " + parserobj.allow + "\r\n";
    trying_res = trying_res + "User-Agent: " + parserobj.useragent + "\r\n";
    trying_res = trying_res + "Content-Length: 0" + "\r\n";

    trying_res = trying_res + "\r\n";
    return trying_res;
}

export function forwardRinging(parserobj) {
    let fwd_res = "SIP/2.0 180 Ringing\r\n";

    let servIp = "202.30.249.27";

    parserobj.via.map((via, idx) => {
        if (idx === 0) {
            let modifiedVia = via.substring(via.indexOf(",") + 1, via.length);
        } else {
            fwd_res = fwd_res + "Via: " + via + "\r\n";
        }
    });

    fwd_res = fwd_res + "From: " + parserobj.from + "\r\n";
    fwd_res = fwd_res + "To: " + parserobj.to + "\r\n";
    fwd_res = fwd_res + "Call-ID: " + parserobj.callId + "\r\n";
    fwd_res = fwd_res + "CSeq: " + parserobj.cseq + "\r\n";

    let modifiedContact = parserobj.contact.substring(0, parserobj.contact.indexOf("@") + 1) + servIp + ">";
    fwd_res = fwd_res + "Contact: " + modifiedContact + "\r\n";
    fwd_res = fwd_res + "User-Agent: " + parserobj.useragent + "\r\n";
    fwd_res = fwd_res + "Content-Length: 0" + "\r\n\r\n";

    return fwd_res;
}

export function forwardOk(parserobj, parserobj2, sdp) {
    let fwd_res = "SIP/2.0 200 OK\r\n";

    parserobj.via.map((via, idx) => {
        if (idx === 0) {
            let upperViaFeild = via;
            let recieved = upperViaFeild.substring(via.indexOf(" ") + 1, via.indexOf(":"));
            upperViaFeild = upperViaFeild + ";recieved=" + recieved;

            // fwd_res = fwd_res + "Via: " + upperViaFeild + "\r\n";
        }
    });

    fwd_res = fwd_res + "Via: " + parserobj.via[1] + "\r\n";
    fwd_res = fwd_res + "Contact: " + parserobj.contact + "\r\n";
    fwd_res = fwd_res + "To: " + parserobj.to + "\r\n";
    fwd_res = fwd_res + "From: " + parserobj.from + "\r\n";
    fwd_res = fwd_res + "Call-ID: " + parserobj.callId + "\r\n";
    fwd_res = fwd_res + "CSeq: " + parserobj.cseq + "\r\n";
    // fwd_res = fwd_res + "Allow: " + parserobj.allow + "\r\n";
    fwd_res = fwd_res + "Content-Type: " + parserobj.contentType + "\r\n";
    // fwd_res = fwd_res + "User-Agent: " + parserobj.useragent + "\r\n";
    // fwd_res = fwd_res + "Allow-Events: " + parserobj.allowevents + "\r\n";
    fwd_res = fwd_res + "Content-Length: " + parserobj.contentLength + "\r\n\r\n";

    fwd_res = fwd_res + sdp;

    return fwd_res;
}

export function forwardInvite(parserobj, parserobj2, sdp) {
    let fwd_res = `${parserobj.m.method} ${parserobj.m.url} ${parserobj.m.version}` + "\r\n";
    let servIp = "202.30.249.27";
    let servPort = "9999";

    fwd_res = fwd_res + "Via: " + "SIP/2.0/TCP " + servIp + ":" + servPort + ";branch=z9hG4bK2d4790;rport " + "\r\n";

    parserobj.via.map((via) => {
        let upperViaFeild = via;
        let recieved = upperViaFeild.substring(via.indexOf(" ") + 1, via.indexOf(":"));
        upperViaFeild = upperViaFeild + ";recieved=" + recieved;

        let rport = upperViaFeild.match(/:+[\d]+;+/g)[0];
        rport = rport.slice(1, rport.length - 1);
        upperViaFeild = upperViaFeild.replace(/rport/gi, "rport=" + rport);

        fwd_res = fwd_res + "Via: " + upperViaFeild + "\r\n";
    });

    fwd_res = fwd_res + "From: " + parserobj.from + "\r\n";
    fwd_res = fwd_res + "To: " + parserobj.to + "\r\n";
    fwd_res = fwd_res + "Call-ID: " + parserobj.callId + "\r\n";
    fwd_res = fwd_res + "CSeq: " + parserobj.cseq + "\r\n";

    // let modifiedContact = parserobj.contact.substring(0, parserobj.contact.indexOf("@") + 1) + servIp + ">";
    // fwd_res = fwd_res + "Contact: " + modifiedContact + "\r\n";
    fwd_res = fwd_res + "Contact: " + parserobj.contact + "\r\n";
    fwd_res = fwd_res + "Content-Type: " + parserobj.contentType + "\r\n";
    fwd_res = fwd_res + "Max-Forwards: " + (Number(parserobj.maxforwards.trim()) - 1) + "\r\n";
    fwd_res = fwd_res + "User-Agent: " + parserobj.useragent + "\r\n";
    fwd_res = fwd_res + "Content-Length: " + parserobj.contentLength + "\r\n\r\n";

    fwd_res = fwd_res + sdp;

    return fwd_res;
}
