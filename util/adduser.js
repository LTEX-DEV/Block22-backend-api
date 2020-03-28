var User=require('../api/user/userModel');
var config=require('../config/config');

var _ = require('lodash');
require('mongoose').connect(config.db.url);
var users=[
    {username:'test',email:'test@test.com',password:'test@123',Clients:[],Codes:[],role:'creator',isadmin:true }
    
];

var createdoc=function(model,doc)
{
    return new Promise(function(resolve,reject){
new model(doc).save(function(err,saved){
    err ? reject(err) : resolve(saved);
});


    });
};


var createUsers=function(data)
{
    
var promises=users.map(function(user){

    //if(user.isadmin==true) user.codes=codes;

    return createdoc(User,user);
});

return Promise.all(promises).then(function(users){
return _.merge({users:users},data || {});
});

}

createUsers(users)
         .catch(function(err){
            console.log(err);
        });