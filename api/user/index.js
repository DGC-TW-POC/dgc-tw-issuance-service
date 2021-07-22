const express = require('express');
const router = express.Router();
const { decodebase64Query } = require('../apiService');

router.post('/claimToken' , require('./controller/postToken'));

router.get('/vabCheckCode' , require('./controller/getVabCheckCode'));
router.get('/verifyIsLogin' , require('./controller/getVerifyIsLogin'));

module.exports = router;