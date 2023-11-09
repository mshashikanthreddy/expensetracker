const mysql = require('mysql2');

const Sequelize = require('sequelize');

// const pool = mysql.createPool({

//     host :  process.env.DB_HOST,
//     user : process.env.DB_USERNAME,
//     database : process.env.DB_NAME,
//     password : process.env.DB_PASSWORD
// })

const sequelize =  new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{

    dialect : 'mysql',
    host : process.env.DB_HOST
})

//module.exports = pool.promise();
module.exports = sequelize;

