var router = require('express').Router();
var controller=require('./controller');
var auth=require('../../auth/auth');




var checkUser=[auth.decodeToken(),auth.getFreshUser()];





router.route("/histories/:count")
      .get(checkUser,controller.getHistories);

router.route("/notifications/:count")
      .get(checkUser,controller.getNotifications);

router.route("/notifications/update")
      .post(checkUser,controller.updateNotificationStatus);

module.exports = router;
