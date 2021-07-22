const express = require('express');
const router = express.Router();
const { validateParams } = require('../validator');
const joi = require('joi');
const { decodebase64Query } = require('../apiService.js')

router.post('/EUJson', require('./controller/postEUJson'));

router.get('/CDCData' , decodebase64Query , validateParams({
    AgencyCode: joi.string().min(10).max(10).allow(''),
    IdNo: joi.string().allow(''),
    person: joi.object().keys({
        IdNo: joi.string().allow(''),
        Name: joi.string().allow(''),
        Birthday: joi.string().allow(''),
    }),
    InocuDate: joi.string().allow(''),
    VaccID: joi.string().allow(''),
    VaccDoses: joi.number().empty(''),
    page: joi.number().default(1)
} , "query" ,{
    allowUnknown: false
}) , require('./controller/getCDCData'));

router.post('/CDCData' , require('./controller/postCDCData'));
router.delete('/CDCData/:id' , require('./controller/deleteCDCData'));

module.exports = router;
