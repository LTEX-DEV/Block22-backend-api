var router=require('express').Router();


var history=require('./history/routes');
var assesment=require('./assesment/routes');
var user=require('./user/routes');
var auth=require('../auth/routes');


router.use("/history",history);
router.use("/assesment",assesment);
router.use("/user",user);
router.use('/auth',auth)


module.exports=router;