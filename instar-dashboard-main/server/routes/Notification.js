const express = require('express')
const router = express.Router()


const pushNotificationController = require ('../controllers/push-notification.controller');


//user route
router.get("/SendNotification",pushNotificationController.SendNotification);
router.post("/SendNotificationToDevice",pushNotificationController.SendNotificationToDevice);
module.exports = router;