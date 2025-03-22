var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { check_authentication, check_roles, isAdmin, isModerator } = require('../utils/check_auth')
let { CreateSuccessRes } = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', check_authentication, isModerator, async function (req, res, next) {
  try {
    let users = await userController.GetAllUsers();
    CreateSuccessRes(res, users, 200);
  } catch (error) {
    next(error)
  }
});

router.get('/:id', check_authentication, async function (req, res, next) {
  try {
    if (req.user._id.toString() !== req.params.id && !['admin', 'mod'].includes(req.user.role.name)) {
      throw new Error('Forbidden - Insufficient permissions');
    }
    let user = await userController.GetAllUsersByID(req.params.id);
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});

router.post('/', check_authentication, isAdmin, async function (req, res, next) {
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

router.put('/:id', check_authentication, isAdmin, async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.UpdateAnUser(req.params.id, body)
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});

router.delete('/:id', check_authentication, isAdmin, async function (req, res, next) {
  try {
    let user = await userController.DeleteAnUser(req.params.id)
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
