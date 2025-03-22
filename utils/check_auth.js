const jwt = require('jsonwebtoken')
const constants = require('./constants')
const userModel = require('../schemas/user')
const { CreateErrorRes } = require('./responseHandler')

const check_authentication = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization
            if (authorization.startsWith("Bearer")) {
                let token = authorization.split(" ")[1]
                let result = jwt.verify(token, constants.SECRET_KEY)
                if (result.expire > Date.now()) {
                    let user = await userModel.findById(result.id).populate('role')
                    req.user = user
                    next()
                } else {
                    throw new Error("ban chua dang nhap")
                }
            } else {
                throw new Error("ban chua dang nhap")
            }
        } else {
            throw new Error("ban chua dang nhap")
        }
    } catch (error) {
        CreateErrorRes(res, error.message, 401)
    }
}

const check_roles = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user?.role?.name) {
                throw new Error("Unauthorized")
            }
            if (!roles.includes(req.user.role.name)) {
                throw new Error("Insufficient permissions")
            }
            next()
        } catch (error) {
            CreateErrorRes(res, error.message, 403)
        }
    }
}

module.exports = {
    check_authentication,
    check_roles,
    isAdmin: check_roles('admin'),
    isModerator: check_roles('admin', 'mod')
}