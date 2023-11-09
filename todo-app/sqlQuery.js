const mysql = require('mysql');

const { Sequelize, DataTypes } = require('sequelize');

SequelizeInstance = new Sequelize(process.env.DB_NAME_SEQUELIZE, process.env.DB_USER, process.env.DB_PASSWORD , {
    host: 'localhost',
    dialect: 'mysql',
})

const pool = mysql.createPool({
    'host': process.env.DB_HOST,
    'user': process.env.DB_USER,
    'password':  process.env.PASSWORD,
    'database': process.env.DB_NAME,
});

function sqlQuery(query, values, callback){
  pool.getConnection((connError, connection) => {
      if(connError){
          console.log(connError);
          throw new Error("Connection error " + connError);
      }
      try {
          connection.query(query, values, (error, result) => {
              if(error){
                  console.log(error);
                  throw new Error("Query error " + error);
              }
              
              callback(result);
          });
      } catch(error){
          throw new Error("Unexpected error occured : " + error);
      }
      connection.release();
  });
}

module.exports = {
    sqlQuery
}