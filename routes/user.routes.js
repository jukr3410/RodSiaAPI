const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

router.get("/users", user.getAllUser);
router.get("/users/:id", user.getUser);
router.get("/users-phone/:phone", user.getUserPhone);
router.post("/users", user.addUser);
router.put("/users/:phone", user.editUser);
router.patch("/users", user.editUser);
router.patch("/users-password", user.editUserPassword);
router.patch("/users-no-password", user.editUserNoPassword);
router.delete("/users/:id", user.deleteUser);
//router.patch('/users/:id/update-car',user.updateUserCar);

module.exports = router;
