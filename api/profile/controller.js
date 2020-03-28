
var _ =require('lodash');

var History=require('../history/HistoryModel');
var Assesment=require('./assesmentModel');
var User=require('../api/user/userModel');



exports.getProfile=function(req,res,next)
{
let userId =  req.params.userId ?  req.params.userId : req.user.id;

if(req.user.role !== "creator" && req.user.id !== userId && !_.some(req.user.clients,{'id':userId}))
{
   
   res.status(401).json({error:"You doesn't have permission to view this profile."});
   return;
    //throw new Error("You doesn't have permission to view assements.")
}



var findUser = function(){



 



}

var getAssesments = function()
{

}

var getClients = function()
{

}

var getHistories = function()
{

}


}






