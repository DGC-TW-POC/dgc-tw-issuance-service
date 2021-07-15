const express = require('express');
const router = express.Router();
const { validateParams } = require('../validator');
const joi = require('joi');

router.post('/EUJson', require('./controller/postEUJson'));

router.get('/CDCData' , validateParams({
    AgencyCode: joi.string().min(10).max(10).allow(''),
    IdNo: joi.string().allow(''),
    Name: joi.string().allow(''),
    Birthday: joi.string().allow(''),
    InocuDate: joi.string().allow(''),
    VaccID: joi.string().allow(''),
    VaccDoses: joi.number().empty('')
} , "query" ,{
    allowUnknown: false
}) , require('./controller/getCDCData'));
router.post('/CDCData' , require('./controller/postCDCData'));
router.delete('/CDCData/:id' , require('./controller/deleteCDCData'));

module.exports = router;
