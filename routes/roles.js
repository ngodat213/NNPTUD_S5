var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles')
let { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler')
let { check_authentication, isAdmin } = require('../utils/check_auth')

/* GET roles listing. */
router.get('/', async function(req, res, next) {
  try {
    let roles = await roleController.GetAllRoles();
    CreateSuccessRes(res,roles,200);
  } catch (error) {
    next(error)
  }
});

router.post('/', check_authentication, isAdmin, async function(req, res, next) {
  try {
    let newRole = await roleController.CreateARole(req.body.name);
    CreateSuccessRes(res,newRole,200);
  } catch (error) {
    next(error)
  }
});

router.put('/:id', check_authentication, isAdmin, async function(req, res, next) {
  try {
    let updatedRole = await roleController.UpdateRole(req.params.id, req.body);
    CreateSuccessRes(res,updatedRole,200);
  } catch (error) {
    next(error)
  }
});

router.delete('/:id', check_authentication, isAdmin, async function(req, res, next) {
  try {
    let deletedRole = await roleController.DeleteRole(req.params.id);
    CreateSuccessRes(res,deletedRole,200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
