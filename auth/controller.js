var signToken=require('./auth').signToken;
var config=require('../config/config');

exports.signin=function(req,resp,next){
var token=signToken(req.user._id);
resp.json({idToken:token,expiresIn:config.expireTime,user:{username:req.user.username,role:req.user.role}});
};


