var router = require('express').Router();
var controller=require('./controller');
var auth=require('../../auth/auth');


var checkUser=[auth.decodeToken(),auth.getFreshUser()];



router.param('userId',controller.params);


router.route("/")
      .post(controller.signUp);


router.get("/me",checkUser,controller.me);


router.route("/generatecodes")
      .post(checkUser,controller.generateCodes);

router.route("/:userId")
      .put(checkUser,controller.update);





router.route("/assign")
      .post(checkUser,controller.assign);

module.exports=router;