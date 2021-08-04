const _ =  require('lodash');
const { decryptData } = require('../../apiService');
/** @type {import("express").RequestHandler} */
module.exports = async function(req, res) {
    try {
        let isLogin = _.get(req.signedCookies , 'isLogin');
        if (isLogin == "1") {
            res.status(200).send({
                user: decryptData(req.session.user)
            });
        }
        res.status(401).send();
    } catch(e) {
        console.error(e);
        res.status(500).send();
    }
}