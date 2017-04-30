var mysql= require("mysql");

//creating MySql DB connection:
var con =mysql.createConnection({
                                 host: "localhost",
                                 user: "root",
                                 password: "root",
                                 database: "grad_proj"
                                });

//Starting the DB connection:
con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


module.exports= con;
