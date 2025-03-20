let userModel = require('../schemas/user')
let roleModel = require('../schemas/role')
let bcrypt = require('bcrypt')

module.exports = {
    GetAllUsers: async function () {
        return await userModel.find({
            isDeleted: false
        })
    },
    CreateAnUser: async function (username, password, email, rolename) {
        try {
            let role = await roleModel.findOne({
                name: rolename
            })
            if (role) {
                let user = new userModel({
                    username: username,
                    password: password,
                    email: email,
                    role: role._id
                })
                return await user.save();
            } else {
                throw new Error("khong tim thay")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },


    UpdateAnUser: async function (id,body) {
        try {
            let user = await userModel.findById(id);
            let allowField = ["password","email","urlImg","role"]
            for (const key of Object.keys(body)) {
                if(allowField.includes(key)){
                    user[key] = body[key];
                }
            }
            return await user.save();
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteAnUser: async function (id) {
        try {
            
            return await userModel.findByIdAndUpdate(
                id,{
                    status:false
                }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
