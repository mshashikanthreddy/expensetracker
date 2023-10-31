const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Forgotpassword = sequelize.define('password',{

    id : {
        type : Sequelize.UUID ,
        allowNull : false,
        primaryKey : true
    },

    isactive : Sequelize.BOOLEAN
})

module.exports = Forgotpassword;