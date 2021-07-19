const faker = require('faker');
const moment = require('moment');
const FakeDataGenerator = require('fake-data-generator-taiwan');
const _ = require('lodash');
const agencyMap = [
    {
        name : "醫療財團法人好心肝基金會好心肝診所" ,
        code : "4001180029"
    },
    {
        name : "臺北榮民總醫院",
        code : "0601160016"
    }
]
const vaccineMap = [
    {
        name : 'Vaxzavria (AZ)' ,
        id : 'EU/1/21/1529',
        type : {
            name : 'SARS-CoV-2 antigen vaccine',
            id : '1119305005'
        } ,
        org : {
            name : 'AstraZeneca AB' ,
            id : 'ORG-100001699'
        }
    } ,
    {
        name : 'COVID-19 Vaccine Moderna (莫德納 COVID-19 疫苗)',
        id: 'EU/1/20/1507' ,
        type : {
            name : 'SARS-CoV-2 mRNA vaccine' ,
            id : '1119349007'
        },
        org : {
            name : 'Moderna Biotech Spain S.L.',
            id : 'ORG-100031184'
        }
    } ,
    {
        name : 'Comirnaty (輝瑞/BNT COVID-19 疫苗)',
        id : 'EU/1/20/1528',
        type : {
            name : 'SARS-CoV-2 mRNA vaccine' ,
            id : '1119349007'
        },
        org : {
            name : 'Biontech Manufacturing GmbH',
            id : 'ORG-100030215'
        }
    }
];
function generateFakePerson () {
    let twGenerator = new FakeDataGenerator();
    let name = twGenerator.Name.generate();
    //let mobile = twGenerator.Mobile.generate(0, 10);
    let idNo = twGenerator.IDNumber.generate();
    //let address = twGenerator.Address.generate();
    let birth = faker.date.past(100 , moment("2021-01-01").toDate());
    let dob = moment(birth).format("YYYY-MM-DD");
    
    let person = {
        IdNo: idNo,
        Name: name,
        Birthday: dob
    };
    return person;
}


function generateFakeVaccine(iPerson) {
    let vaccineData = {
        AgencyCode :"" ,
        IdNo: iPerson.IdNo,
        Name: iPerson.Name,
        Birthday: iPerson.Birthday,
        InocuDate: "",
        VaccID: "",
        VaccDoses: 1
    }
    let doVaccinationList = [];
    vaccineData.AgencyCode = agencyMap[faker.datatype.number(1)].code;
    let firstVaccineDate = faker.date.between("2021-05-01", new Date());
    let firstVaccineDateYYYYMMDD = moment(firstVaccineDate).format("YYYY-MM-DD");
    vaccineData.InocuDate = firstVaccineDateYYYYMMDD;
    let doVaccineID = vaccineMap[faker.datatype.number(2)].id;
    vaccineData.VaccID = doVaccineID;
    doVaccinationList.push(vaccineData);


    let nextVaccineDay = faker.datatype.number({
        min: 40 ,
        max: 84
    });
    let secondVaccineDate = moment(firstVaccineDate).add(nextVaccineDay , 'd').format("YYYY-MM-DD");
    if (moment(secondVaccineDate).isBefore(new Date())) {
        let secondVaccineData = _.cloneDeep(vaccineData);
        secondVaccineData.VaccDoses = 2;
        secondVaccineData.InocuDate = secondVaccineDate;
        doVaccinationList.push(secondVaccineData);
    }
    return doVaccinationList;
}

function generateFakeData () {
    let fakePerson = generateFakePerson();
    let fakeVaccine = generateFakeVaccine(fakePerson);
    return fakeVaccine;
}

module.exports = {
    generateFakeData: generateFakeData
}
