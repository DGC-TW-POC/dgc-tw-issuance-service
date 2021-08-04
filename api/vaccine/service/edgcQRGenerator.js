/*
 * eu-digital-green-certificates/ dgca-issuance-web
 *
 * (C) 2021, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//import { createCertificateQRData, CertificateMetaData } from './edgcProcessor'
//import axios from 'axios';
const { createCertificateQRData } = require('./edgcProcessor');
const axios = require('axios');


const api = axios.create({
    baseURL: '',
    headers: {
        "Content-Type": "application/json"
    },
});


/*export interface CertResult {
    qrCode: string,
    dgci: string,
    tan: string
}

enum CertType {
    Vaccination = 'Vaccination',
    Recovery = 'Recovery',
    Test = 'Test'
}


interface CertificateInit {
    greenCertificateType: CertType,
}

interface SigResponse {
    signature: string,
    tan: string
}*/

const CertType = {
    Vaccination : 'Vaccination',
    Recovery : 'Recovery',
    Test : 'Test'
}

const apiUrl = 'https://twdgci.dicom.tw'
const signerCall = (id , hash ) => {
    return api.put(`${apiUrl}/dgca-issuance-service/dgci/issue/` + id, { hash: hash })
        .then(res => {
            const sigResponse = res.data;
            return sigResponse;
        });
}

const setDgci = (dgcPayload, dgci) => {
    if (dgcPayload) {

        if (dgcPayload.v) {
            for (let vac of dgcPayload.v) {
                vac.ci = dgci;
            }
        }
        if (dgcPayload.r) {
            for (let rec of dgcPayload.r) {
                rec.ci = dgci;
            }
        }
        if (dgcPayload.t) {
            for (let tst of dgcPayload.t) {
                tst.ci = dgci;
            }
        }
    }
}

const getEdgcType = (edgcPayload) => {
    return edgcPayload.r ? CertType.Recovery
        : edgcPayload.t
            ? CertType.Test
            : CertType.Vaccination;
}


const generateQRCode = (edgcPayload) => {
    const certInit = {
        greenCertificateType: getEdgcType(edgcPayload)
    }
    let tan = '';

    return api.post(`${apiUrl}/dgca-issuance-service/dgci/issue`, certInit)
        .then(response => {
            const certMetaData = response.data;
            setDgci(edgcPayload, certMetaData.dgci);
            return createCertificateQRData(edgcPayload, certMetaData,
                (hash) => {
                    return signerCall(response.data.id.toString(), hash)
                        .then((sigResponse) => {
                            tan = sigResponse.tan;
                            return sigResponse.signature;
                        });
                })
                .then((qrCode) => {
                    //console.log("qr code: "+qrCode);
                    return {
                        qrCode: qrCode,
                        dgci: certMetaData.dgci,
                        tan: tan
                    }
                });
        });
}

module.exports = {
    generateQRCode : generateQRCode
}