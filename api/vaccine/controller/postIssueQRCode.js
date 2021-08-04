const { generateQRCode } = require('../service/edgcQRGenerator');
const CryptoJS = require('crypto-js');
const _ = require('lodash');
const { storeVaccineData } = require('./postCDCData');
const { sendTANEmail } = require('../service/sendEmail');

/** @type {import("express").RequestHandler} */
module.exports = async function(req , res) {
    try {
        let eudgc = _.get(req , "body.eudgc");
        let cdcVaccineData = _.get(req , "body.cdcVaccine");
        if (!eudgc && !cdcVaccineData) {
            return res.status(400).send({
                message: "錯誤的上傳訊息"
            });
        }
        let {status , data} = await doGenerateQRCode(eudgc);
        let certResult = _.cloneDeep(data);
        if (status == 1) {
            let responseQRCode = {
                qrCode: certResult.qrCode
            }
            let dgciWordArray = CryptoJS.enc.Utf8.parse(data.dgci);
            let dgciHash = CryptoJS.SHA256(dgciWordArray).toString(CryptoJS.enc.Base64);
            cdcVaccineData.dgci_hash = dgciHash;
            cdcVaccineData.qrcode = certResult.qrCode;
            let storeVaccineDataStauts = await storeVaccineData(cdcVaccineData , (e)=> {
                return res.status(500).send(e);
            });
            if (storeVaccineDataStauts) {
                let sendTANEmailRes = await sendTANEmail(cdcVaccineData, certResult.tan);
                if (sendTANEmailRes.status == 1) {
                    return res.send(responseQRCode);
                } 
                return res.status(500).send({
                    message: sendTANEmailRes.data
                });
            }
        } else {
            res.status(500).send({
                message: certResult
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: e
        });
    }

}

function doGenerateQRCode(item) {
    return new Promise((resolve) => {
        generateQRCode(item)
        .then(certResult => {
            console.dir(certResult, {depth : null});
            resolve({
                status: 1,
                data: certResult
            });
        })
        .catch(error=> {
            console.error(error);
            resolve({
                status: 0,
                data: error
            });
        })
    })
    
}