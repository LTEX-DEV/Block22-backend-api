var History=require('./HistoryModel');
var _ =require('lodash');



exports.getHistories=function(req,res,next)
{

const me=req.user;
const count=req.params.count;

var query;

if(!count)
{

query=History.find({from:me}).populate('from').populate('to').sort({"actionDate":-1});

}
else{

    query=History.find({from:me}).populate('from').populate('to').sort({"actionDate":-1}).limit(+count);

}


query.then(function(results){
    res.json(results);

}).catch((err)=>{
    next(err);
});

}

exports.getNotifications=function(req,res,next)
{

    const me=req.user;
    const count=req.params.count;

    

    const clientIds= _.map(me.clients,"id");

    

    if(!count)
    {

    query=History.where("from").in(clientIds).populate('from').populate('to').sort({"actionDate":-1});

    }
    else{

        query=History.where("from").in(clientIds).populate('from').populate('to').sort({"actionDate":-1}).limit(+count);

    }

   
          query.then(function(notifications){
    
        res.json(notifications);
        
    }).catch((err)=>{
        next(err);
    });


}
    
exports.updateNotificationStatus = function(req,res,next)
{

    const notificationIds=req.body.notificationIds;

History.where("_id").in(notificationIds).update({},{$set: {"read": true}},{"multi":true}).then((resp)=>{

    res.json({});

}).catch((err)=>{
    next(err);
})



}

