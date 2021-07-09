const _ = require('lodash');
const romanize = require('romanize-names');
module.exports = async function(req, res) {
    try {
        let item = req.body;
        let json = CDC2EUJson(item);
        return res.json(json);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}


function CDC2EUJson(CDCData) {
    console.log(CDCData);
    let dataList = _.get(CDCData, "Data");
    console.log(dataList);
    /* let EUJsonMap = {
         "nam" : {
             "fn" : "護照LastName" ,
             "fnt" : "Data.Name "個案姓名，中文姓名或護照LastName轉大寫""
             "gn" : "護照First Name" ,
             "gnt" : "護照LastName轉大寫"
         },
         "dob" : "Data.Birthday" ,
         "v" : {
             "tg" : "840539006" ,
             "vp" : "Data.VaccID" ,
             "ma" : "Innventory.VaccID+Innventory.VaccBrand" ,
             "dn" : "Data.VaccDoses" ,
             "sd" : "max(疫苗代碼表.疫苗劑次)" ,
             "dt" : "Data.InocuDate" ,
             "co" : "TW",
             "is" : "AgencyCode"
         }
     }*/
    for (let data of dataList) {
        let EUJson = {};
        let CDCName = _.get(data, "Name");
        if (CDCName) {
            _.set(EUJson, "nam.fnt", CDCName);
            let fullName = _.get(EUJson, "nam.fnt");
            let romanizeName = "";
            try {
                romanizeName = romanize(fullName);
            } catch (e) {
                romanizeName = fullName;
            }
            _.set(EUJson, "nam.fn", romanizeName.split(" ").shift());
            _.set(EUJson, "nam.gn", romanizeName.split(" ").pop());
            _.set(EUJson, "nam.gnt", _.get(EUJson, "nam.gn").toUpperCase());
        } else {
            _.set(EUJson, "nam.fnt", "Unknown");
            _.set(EUJson, "nam.fn", "Unknown");
            _.set(EUJson, "nam.gn", "Unknown");
            _.set(EUJson, "nam.gnt", "UNKNOWN");
        }
        let CDCBirthday = _.get(data, "Birthday");
        if (CDCBirthday) {
            _.set(EUJson, "dob", CDCBirthday);
        } else {
            _.set(EUJson, "dob", "");
        }
        _.set(EUJson, "v", []);
        let vaccineItem = {};
        _.set(vaccineItem, "tg", "840539006");
        let CDCVaccID = _.get(data, "VaccID");
        _.set(vaccineItem, "vp", CDCVaccID);
        _.set(vaccineItem, "ma", "TBD");
        let CDCVaccDoses = _.get(data, "VaccDoses");
        _.set(vaccineItem, "dn", Number(CDCVaccDoses));
        _.set(vaccineItem, "sd", 2);
        let CDCInocuDate = _.get(data, "InocuDate");
        _.set(vaccineItem, "dt", CDCInocuDate);
        _.set(vaccineItem, "co", "TW");
        let CDCAgencyCode = _.get(CDCData , "AgencyCode");
        _.set(vaccineItem, "is", CDCAgencyCode);
        EUJson["v"].push(vaccineItem);
        console.log(EUJson);
    }
}