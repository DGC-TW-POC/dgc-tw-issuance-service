const nodeFetch = require('node-fetch');
const { getUserVabJar } = require('../../apiService');

/** @type {import("express").RequestHandler} */
module.exports = async function(req, res) {
    try {
        let userVabJar = getUserVabJar(req);
        const fetch = require('fetch-cookie')(nodeFetch ,userVabJar);
        await fetch("https://1922.gov.tw/vab/");
        req.session.vabApp = await userVabJar.getCookieString("https://1922.gov.tw");
        let fetchVabCheckCodeRes = await fetch("https://1922.gov.tw/vab/validateCodeService.do");
        let vabCheckCodeBlob = await fetchVabCheckCodeRes.blob();
        res.type(vabCheckCodeBlob.type);
        let vabCheckCodeArrayBuffer = await vabCheckCodeBlob.arrayBuffer();
        res.send(Buffer.from(vabCheckCodeArrayBuffer));
    } catch(e) {
        console.error(e);
        res.status(500).send();
    }
    
}