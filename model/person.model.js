var orm = require('../config/orm');
module.exports ={
    addPerson:(FullName, Email, Password)=>{
        return orm.selectAll(`call AddPerson_New('${FullName}','${Email}','${Password}')`);
    },   
    getPersonWithEmail:(Email)=>{
        return orm.selectAll(`call GetPersonWithEmail_New('${Email}')`);
    },
    getPersonWithID:(ID)=>{
        return orm.selectAll(`call GetPersonWithID_New(${ID})`);
    },
    updateEmailAndFullNameWithID:(ID, Email, FullName)=>{
        return orm.selectAll(`call UpdateEmailAndFullNameWithID(${ID},'${Email}','${FullName}')`);
    },
    updatePasswordWithID:(ID, Password)=>{
        return orm.selectAll(`call UpdatePasswordWithID(${ID},'${Password}')`);
    },
    updateInfoWithID:(ID, Email, FullName, Avatar)=>{
        return orm.selectAll(`call UpdateInfoWithID(${ID},'${Email}','${FullName}','${Avatar}')`);
    },
    updateAvatarWithID:(ID, Avatar)=>{
        return orm.selectAll(`call UpdateAvatarWithID(${ID},'${Avatar}')`);
    }
}