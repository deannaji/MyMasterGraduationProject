var  mysql= require("../model/mysqlModel.js"),
     fs= require ("fs");


//Adding students using a CSV file:
exports.addStudents= function(req, res){
	var content= req.file.buffer.toString();
	var insertStr="",
      studentsNum=0,
	    comma=0,
	    substr="";
	for(var element in content){
	   	if(content[element] === ","){
          comma++;
          switch(comma){
          	 case 2://first name
          	   insertStr= insertStr + ",('" + substr + "','";
               studentsNum++;
          	   break;
          	 case 3://last name
          	   insertStr= insertStr + substr + "','";
          	   break;
             case 4://email
               insertStr= insertStr + substr + "')";
          	   break;
          	 case 5://end of line
               comma=0;
          	   break;
          }
          substr="";

	   	}else{
          substr= substr + content[element];
	   	}
	}

    var lastRow=0;

    mysql.query("select max(student_cwid) as last_student from student", function(err,result){

         if(err){
          console.log(err);
          return;
         }
         lastRow= result[0].last_student;
         //insert the fname, lname, email into student table:
         var sql1="insert into student (first_name, last_name, email) values "+ insertStr.slice(1);
         mysql.query(sql1, [insertStr.slice(1)], function(err, result){
            if(err){
              console.log(err);
              return;
            }
            //create insert string (query) for the enrollment table:
            var sql2="insert into enrollment values ";
            for(var i = lastRow +1; i <= lastRow + studentsNum; i++){
              if(i === lastRow +1){
                 sql2= sql2 + "(" + i + "," + req.body.session_id + ")";
              }else{
                 sql2= sql2 + ",(" + i + "," + req.body.session_id + ")";
              }
            }//end of for
            mysql.query(sql2, function(err, result){
                if(err){
                  console.log(err);
                  return;
                }
                //Now, we need to insert student ID's and sesstion ID into the grades table, to register students in the grades table:
                var sql3= "insert into grades (student_cwid, session_id) values ";
                for(var i = lastRow +1; i <= lastRow + studentsNum; i++){
                   if(i === lastRow +1){
                        sql3= sql3 + "(" + i + "," + req.body.session_id + ")";
                   }else{
                        sql3= sql3 + ",(" + i + "," + req.body.session_id + ")";
                   }//end if
                }//end of for
                mysql.query(sql3, function(err, result){
                  if(err){console.log(err); return;}
                  //done!
                });
            });
         });
    });
   res.redirect("/faculty.html");
};
