var jwt=require('jsonwebtoken');
var expressjwt=require('express-jwt');
var config=require('../config/config');
var checkToken=expressjwt({secret:config.secrets.jwt});

var User=require('../api/user/userModel');


exports.decodeToken=function()
{
    return function(req,res,next)
    {
        if(req.query && req.query.hasOwnProperty('access_token'))
        {
req.headers.authorization='Bearer '+ req.query.access_token;
        
        }

        checkToken(req,res,next);
        
    }
};

exports.getFreshUser=function()
{
    return function(req,res,next)
    {
User.findById(req.user._id).populate({path:'clients', populate: { path: 'clients' }}).then(function(user){
if(!user)
{
    res.status(401).json({error:"Unauthorized"});
}
else
{
req.user=user;
next();
}
},function(err){
    next(err);
})        
    }
};

exports.verifyUser=function()
{
    return function(req,resp,next)
    {
        var username=req.body.username;
        var password=req.body.password;

          // if no username or password then send
    if (!username || !password) {
        resp.status(400).send('You need a username and password');
        return;
      }

        User.findOne({username:username}).then(function(user){

            if(!user)
            {
                resp.status(401).json({error:"No user found with this username"});

            }
            else{
                if(!user.authenticate(password))
                {
resp.status(401).json({error:"Wrong Password"});
                }else
                {
                    req.user=user;
                    next();
                }
            }


        },function(err){
            next(err);
        });
    };
};

exports.signToken=function(id)
{
return jwt.sign(
    {_id:id},
    config.secrets.jwt,
    {expiresIn: config.expireTime}

);

};

