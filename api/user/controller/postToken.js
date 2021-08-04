const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { Op } = require('sequelize');
const nodeFetch = require('node-fetch');
const { getUserVabJar, encryptData } = require('../../apiService')

const authMethodImp = {
    "身份證+健保卡": async (req) => {
        //#region  本地模擬code
        let identityNum = req.body.idn;
        let NHINum = req.body.nhCard;
        const sequelize = await require('../../../models/sql');
        let foundPerson = await sequelize.models['person'].findOne({
            where: {
                [Op.and]: [
                    {
                        IdNo: identityNum
                    },
                    {
                        NHIId: NHINum
                    }
                ]
            }
        });
        if (foundPerson) {
            return true;
        }
        return false;
        //#endregion
    },
    "身份證+健保卡vab": async (req) => {
        //#region 以`疫苗接種預約平台`爬蟲模擬登入 code
        try {
            delete req.body['authMethod'];
            let userVabJar = getUserVabJar(req);
            const fetch = require('fetch-cookie')(nodeFetch , userVabJar);
            let loginRes = await fetch("https://1922.gov.tw/vab/payerLoginService.do" , {
                method : "POST" ,
                body : JSON.stringify(req.body) ,
                redirect: 'follow'
            });
            if (loginRes.status !=200) {
                return false;
            }
            let loginResJson = await loginRes.text();
            if (loginResJson) {
                console.log(loginResJson);
                return true;
            }
        } catch(e) {
            console.error(e);
            return false;
        }
        //#endregion
    }
}
//https://stackoverflow.com/questions/51099835/how-to-get-intellisense-for-middleware-of-express-in-external-file-in-vscode
/** @type {import("express").RequestHandler} */
module.exports = async function (req, res) {
    let username = _.get(req, 'body.username') || _.get(req, 'body.idn');
    let password = _.get(req, 'body.password') || _.get(req, 'body.nhCard');
    let authMethod = _.get(req, 'body.authMethod') || "身份證+健保卡";
    let isPersonPresent = await authMethodImp[authMethod](req);
    if (isPersonPresent) {
        res.cookie('isLogin', '1', {
            signed: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        });
        let token = jwt.sign({
            username : username
        }, "A!t:v%dDt&M$ML2", {
            expiresIn: 1000 * 60 * 60
        });
        req.session.user = encryptData(username);
        res.cookie('token', token, {
            signed: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        })
        return res.status(201).send();
    }
    return res.status(401).send();
}
