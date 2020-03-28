var mongoose=require('mongoose');
const uuidv4 = require('uuid/v4');
var User=require('./userModel');
var History=require('../history/HistoryModel');
var _=require('lodash');
var signToken = require('../../auth/auth').signToken;
var config=require('../../config/config');



exports.params=function(req,res,next,userId)
{
User.findById(userId)
    .select("-password")
    .exec()
    .then(function(user){
        if(!user)
        {
           res.status(404).json({error:"User not found."});
           return;
        }
        else{
            req.user=user;
            next();
        }
    },function(err)
        {
            next(err);
        })
    
};

exports.update=function(req,res,next)
{
var user=req.user;
var update=req.body;

_.merge(user,update);

 

/*
user.save(function(err,saved){
    if(err)
    {
        next(err)
    }else
    {
        res.json(saved.toJson());
    }
});*/


}


exports.signUp = function(req,res,next)
{

    var newUser=req.body;

    var saveUser=function()
    {
        
        if(newUser.role=="creator")  {
            res.status(400).json({error:"Invalid User"});
            return;
        }

return User.create(newUser);
    }



    var addHistory= function(user)
{

var history= new History({
    
    action:'signup',
    from:user,
    read:false,
    actionDate:Date.now()

});

return History.create(history).then(function(history){
    return _.concat(user,history);
});

}
   
    var signIn=function(results)
    {

        var token= signToken(results[0]._id)
            
        res.json({idToken:token,expiresIn:config.expireTime,user:{username:results[0].username,role:results[0].role}});
        
    }

    
saveUser().then(addHistory)
         .then(signIn)
         .catch((err)=>{

    next(err)

});
    


}

exports.me = function(req, res) {
  
    res.json(req.user.toJson());
  };


var generateRandomCodes = function()
{
let codes=[];

for(let i=0; i<50; i++)
{
    var id=  uuidv4();
    codes.push(id);


}

return codes;

}

exports.generateCodes= function(req,res,next)
{
    if(req.user.role!=="creator") 
    {
        res.status(401).json({error:"You does not have permission to generate code."});
            return;
    }

let codes=generateRandomCodes();

let me=req.user;

let mycodes=_.concat(me.codes,codes);

me.codes=mycodes;

me.save().then(function(user){

res.json({
    info:codes.length + " codes has been generated.",
    data:{codeCount:user.codes.length}

});

}).catch((err)=>{
next(err)
});




}


exports.assign=function(req,res,next)
{

  //  var query;
  //  if(req.user.role=='creator') query={creator: req.user.username}; //benri
  //  if(req.user.role=='consultant') query={consultant: req.user.username}; //consultant
  //  if(req.user.role=='client') query={client: req.user.username}; // client
    


var to=req.body.email;
var codeCount=parseInt(req.body.count);
var me=req.user;
var myCodes = [] = me.codes;



var findUser=function()
{
    return new Promise(function(resolve,reject){

       
            

if(to === me.email) {
    res.status(400).json({error:"You can't assign codes to your self."});
    return;
    //reject(new Error("You can't assign codes to your self."));
}

        User.findOne({email:to}).populate("clients").then(function(user){
    
            if(!user) {
                res.status(404).json({error:"No user found with this email."});
                return;

            //reject(new Error("No user found with this email."))

            }
           else if(me.role=="client" || user.role=="creator")
           {
            res.status(401).json({error:"You does not have permission to assign code."});
            return;


            //reject(new Error("You does not have permission to assign code."))
           }
            else if(me.role=="creator" && user.role!=="consultant"){

                res.status(400).json({error:"User must be a consultant."});
            return;
                //reject(new Error("User must be a consultant."))
           }
           else{
            resolve(user)
           }
            
        }).catch(function(err){
            next(err);
        })

    })
};


var checkUserConsultant=function(user)
{
    return new Promise(function(resolve,reject){

    User.find({ "clients": mongoose.Types.ObjectId(user.id)},function(err,consultants){

        if(err || (consultants.length > 0 && !_.some(consultants,{'id':req.user.id}))) { 
            
            res.status(400).json({error:"Client already has consultant."});
            return;
            //reject(new Error("User already has consultant."))


        }
resolve(user);

        });
    
    })

};



var exchangeCodes=function(user){

        if(myCodes.length < codeCount) 
        {
            res.status(400).json({error:"you have " + myCodes.length +" code availlable"});
            return;
        
            //throw new Error("you have " + myCodes.length +" code availlable");
        }  
        
        var codes = _.take(myCodes,codeCount)
        
       var userCodes=_.concat(user.codes,codes);
       
       user.codes=userCodes;
       user.consultantEmail=me.email;
       me.codes=_.difference(myCodes,codes);
       me.clients=_.unionBy([user],me.clients,'username');
        me.soldCount+=codeCount;
       
     var promises=  [user,me].map(function(curUser){
    return curUser.save();
       });

     
        return Promise.all(promises).then(function(users){
return _.concat(users,codeCount);

        });
    

    };


    var addHistory= function(results)
    {
    
    var history= new History({
        
        action:'sold',
        from:results[1],
        to:results[0],
        codeCount:results[2],
        read:false,
        actionDate:Date.now()
    
    });
    
    
    return History.create(history).then(function(history){
        return _.concat(results);
    });
  
    }


    findUser().then(checkUserConsultant)
              .then(exchangeCodes)
              .then(addHistory)
              .then(function(result){
                  
                res.json({
                    info: result[2] + " codes assigned to "+ result[0].username + ".",
                    data:{
                        codeCount:result[1].codes.length,
                        clients:result[1].clients
                    } 
                });
                
              })
              .catch(function(err)
    {
        next(err);
    });


}


