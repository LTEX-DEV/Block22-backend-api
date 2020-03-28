var User=require('../api/user/userModel');

var Assesment=require('../api/assesment/assesmentModel');
var _ = require('lodash');


var users=[
    {username:'test',email:'test',password:'test@123',Clients:[],Codes:[],role:'creator',isadmin:true },
    {username:'test2',email:'test2@test.com',password:'test@234',Clients:[],Codes:[],role:'consultant',isadmin:false },
    {username:'test3',email:'test3@test.com',password:'test@235',Clients:[],Codes:[],role:'client',isadmin:false }
    
];

var codes=[
"wdfrdvssdf",
"wdf34ffwfrfg",
"wd677hgbcdf",
"whn67hgfggf",
"wd892wsdfvf"

]

var assesments=[

]


var createdoc=function(model,doc)
{
    return new Promise(function(resolve,reject){
new model(doc).save(function(err,saved){
    err ? reject(err) : resolve(saved);
});


    });
};


var cleanDB=function(){
console.log("cleaning DB....");

var promises=[User,Assesment].map(function(model){
    return model.remove().exec();
});

return Promise.all(promises);

}


var createUsers=function(data)
{
    
var promises=users.map(function(user){

    if(user.isadmin==true) user.codes=codes;

    return createdoc(User,user);
});

return Promise.all(promises).then(function(users){
return _.merge({users:users},data || {});
});

}



var createAssessments=function(data)
{
console.log(data);

var user1=data.users[0];

var promises=user1.codes.map(function(code){

    var assesment={code:code,answers:[
        [ 
            "1", 
            "0", 
            "1"
        ],   
        [ 
            "1", 
            "0", 
            "0"
        ],
        [ 
            "1", 
            "1", 
            "0"
        ],
        [ 
            "0", 
            "1", 
            "0"
        ],
        [ 
            "0", 
            "1", 
            "1"
        ],
        [ 
            "1", 
            "1", 
            "1"
        ],
        [ 
            "0", 
            "0", 
            "0"
        ],
        [ 
            "1", 
            "1", 
            "0"
        ],
        [ 
            "1", 
            "0", 
            "0"
        ],
        [ 
            "1", 
            "0", 
            "1"
        ],
        [ 
            "1", 
            "1", 
            "1"
        ],
        [ 
            "0", 
            "1", 
            "1"
        ],
        [ 
            "0", 
            "1", 
            "0"
        ],
        [ 
            "0", 
            "1", 
            "0"
        ],
        [ 
            "0", 
            "1", 
            "0"
        ],
        [ 
            "1", 
            "1", 
            "1"
        ],
        [ 
            "0", 
            "0", 
            "1"
        ],
        [ 
            "1", 
            "0", 
            "1"
        ],
        [ 
            "1", 
            "0", 
            "1"
        ],
        [ 
            "1", 
            "0", 
            "1"
        ],
        [ 
            "1", 
            "0", 
            "1"
        ],
        [ 
            "0", 
            "1", 
            "0"
        ]
    ],user:user1 }

    createdoc(Assesment,assesment);
})

return Promise.all(promises).then(function(assesments){
    return _.merge({assesments:assesments},data || {});
})

}


cleanDB().then(createUsers).then(createAssessments)
         .catch(function(err){
            console.log(err);
        });