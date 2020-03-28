var router = require('express').Router();
var controller=require('./controller');
var auth=require('../../auth/auth');


var checkUser=[auth.decodeToken(),auth.getFreshUser()];

router.route("/:userId?")
      .get(checkUser,controller.getProfile);



module.exports = router;
