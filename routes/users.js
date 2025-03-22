var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')

let { CreateSuccessRes } = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authorization;
      if(authorization.startsWith("Bearer")){
        let token =authorization.split(" ")[1]
        let result = jwt.verify(token, constants.SECRET_KEY);
        if (result.expire>Date.now()) {
          let users = await userController.GetAllUsers();
          CreateSuccessRes(res, users, 200);
        }else{
          throw new Error("ban chua dang nhap")
        }
      }else{
        throw new Error("ban chua dang nhap")
      }
    } else {
      throw new Error("ban chua dang nhap")
    }
  } catch (error) {
    next(error)
  }

});
router.post('/', async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.CreateAnUser(
      body.username, body.password, body.email, body.role
    )
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.UpdateAnUser(req.params.id, body)
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id', async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.DeleteAnUser(req.params.id)
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
