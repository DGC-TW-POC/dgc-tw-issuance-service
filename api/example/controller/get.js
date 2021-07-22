/** @type {import("express").RequestHandler} */
module.exports = async function(req, res) {
    res.send("hello world");
    res.end();
}