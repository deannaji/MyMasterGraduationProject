var  mysql= require("../model/mysqlModel.js"),
     fs= require ("fs");


//routes:


//user login(mysql):
exports.login= function(req, res){
   var user=req.query;
   var usersSQL="select users.role, users.membership_id from users where username=? and password=?";
   mysql.query(usersSQL, [user.username, user.password], function(err, result){
        if (result.length===0){
           res.json({"status":"invalid"});
        }
        else{
            var role= result[0].role,
                role_id=result[0].membership_id;
            if(role ==="faculty"){
              mysql.query("select membership.faculty_id from membership join users on membership.id = users.membership_id where users.membership_id=?", [role_id], function(err,result){
                 if(err){console.log(err); return;}
                 //success:
                 var faculty_id= result[0].faculty_id;
                 mysql.query("select * from faculty where faculty_id=?", [faculty_id], function(err, result){
                     if(err){console.log(err); return;}
                     //success:
                     var first_name=result[0].first_name,
                         last_name=result[0].last_name,
                         email= result[0].email;
                     res.json({"status":"valid",
                               "id": role_id,
                               "role": role,
                               "first_name": first_name,
                               "last_name": last_name,
                               "email": email
                             });
                 });
              });
            }else if(role === "admin"){
              mysql.query("select membership.admin_id from membership join users on membership.id = users.membership_id where users.membership_id=?", [role_id], function(err,result){
                 if(err){console.log(err); return;}
                 //success:
                 var admin_id= result[0].admin_id;
                 mysql.query("select * from admins where admin_id=?", [admin_id], function(err, result){
                     if(err){console.log(err); return;}
                     //success:
                     var first_name=result[0].first_name,
                         last_name=result[0].last_name,
                         email= result[0].email;
                     res.json({"status":"valid",
                               "id": role_id,
                               "role": role,
                               "first_name": first_name,
                               "last_name": last_name,
                               "email": email
                             });
                 });
              });
            }
        }
   });
};

//new user register:
exports.register= function(req, res){
  var username= req.body.username,
      password= req.body.password,
      firstName= req.body.firstName,
      lastName= req.body.lastName,
      email= req.body.email;

  //adding new faculty to the faculty table:
  var sql1="insert into faculty (first_name, last_name, email) values(?,?,?)";
  mysql.query(sql1, [firstName, lastName, email], function(err, result1){
      if(err){console.log(err);return;}
           //when successfully added, get back the auto-generated faculty ID number from the faculty table:
           var sql2="select faculty_id from faculty where first_name=? and last_name=?";
           mysql.query(sql2,[firstName, lastName], function(err, result2){
               if(err){console.log(err); return;}
               var facultyId= result2[0].faculty_id;
                  mysql.query("insert into membership (faculty_id) values(?)",[facultyId], function(err, result22){
                     if(err){console.log(err); return;}
                     mysql.query("select id from membership where faculty_id=?",[facultyId], function(err, result23){
                         if(err){console.log(err); return;}
                         var membershipId= result23[0].id;
                         //adding the new faculty as a new user to the users table:
                         var sql3="insert into users (username, password, role, membership_id) values (?,?,?,?)";
                         mysql.query(sql3, [username, password, "faculty", membershipId], function(err, result3){
                                if(err){console.log(err); return;}
                                res.json({"status":"success", "id":facultyId});
                         });
                      });
                  });

           });
  });

};

//Change password:
exports.changePwd= function(req, res){
  var oldpwd= req.body.oldpassword,
      newpwd= req.body.newpassword,
      username= req.body.username;
      console.log(oldpwd+ newpwd+ username);
      mysql.query("update users set password=? where username=? and password=? ", [newpwd, username, oldpwd], function(err, result){
         if(err){
           console.log(err);
           return;
         }
         res.json({status: 200});
      });
};
