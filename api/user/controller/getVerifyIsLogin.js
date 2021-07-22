const _ =  require('lodash');
/** @type {import("express").RequestHandler} */
module.exports = async function(req, res) {
    try {
        let isLogin = _.get(req.signedCookies , 'isLogin');
        console.log(isLogin);
        if (isLogin == "1") {
            res.status(200).send();
        }
        res.status(401).send();
    } catch(e) {
        console.error(e);
        res.status(500).send();
    }
}