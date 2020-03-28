var Assesment=require('./assesmentModel');
var _ =require('lodash');
var History=require('../history/HistoryModel');


exports.assesments=function(req,res,next)
{
let userId =  req.params.userId ?  req.params.userId : req.user.id;


if(req.user.role !== "creator" && req.user.id !== userId && !_.some(req.user.clients,{'id':userId}))
{
   
   res.status(401).json({error:"You doesn't have permission to view assements."});
   return;
    //throw new Error("You doesn't have permission to view assements.")
}


Assesment.find({user:userId})
    .exec()
    .then(function(assesments){

        res.json(assesments);
    },function(err)
    {
        next(err);
    });


}

exports.saveAssesment=function(req,res,next)
{

    var me = req.user;

    
    if(!me.codes.length)
    {

        res.status(400).json({error:"You have no codes available."});
        return;
//throw new Error("you have no codes available");
    }
    
    var thisCode=me.codes[0];

    var mycodes=_.difference(me.codes,[thisCode]);

    me.codes=mycodes;
    me.assesmentCount+=1;
    
    var assesment=new Assesment({user:req.user.id,answers:req.body.answers,code:thisCode,createdDate:Date.now()});
    
    var promises=  [assesment,me].map(function(model){
        return model.save();
           });
    
    
           var addHistory= function(results)
           {
           
           var history= new History({
               code:results[0].code,
               action:'assesment',
               from:results[1],
               assesment:results[0],
               read:false,
               actionDate:Date.now()
           
           });
           
           return History.create(history);
           
           }
              

       Promise.all(promises).then(addHistory).then(function(result){

                        res.json({info:"Assesment saved."})
                        
                        }).catch(function(err){
                            next(err);
                });

}


