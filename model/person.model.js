var orm = require('../config/orm');
module.exports ={
    addPerson:(FullName,Email,Password)=>{
        return orm.selectAll(`call AddPerson('${FullName}','${Email}','${Password}')`);
    },    
    getPersonWithEmail:(Email)=>{
        return orm.selectAll(`call GetPersonWithEmail('${Email}')`);
    },
    getPersonWithID:(ID)=>{
        return orm.selectAll(`call GetPersonWithID(${ID})`);
    }
}