var router = require('express').Router();
var verifyuser=require('./auth').verifyUser;
var controller=require('./controller');




router.post('/signin',verifyuser(),controller.signin);



module.exports=router;