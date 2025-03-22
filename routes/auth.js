var express = require('express');
var router = express.Router();
var userController = require('../controllers/users')
let { CreateSuccessRes } = require('../utils/responseHandler');
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')

/* GET home page. */
router.post('/login', async function (req, res, next) {
    try {
        let body = req.body;
        let username = body.username;
        let password = body.password;
        let userID = await userController.CheckLogin(username, password);
        CreateSuccessRes(res, jwt.sign({
            id:userID,
            expire:(new Date(Date.now()+60*60*1000)).getTime()
        },constants.SECRET_KEY), 200)
    } catch (error) {
        next(error)
    }
});
//67de10517282904fbca502ae
module.exports = router;
