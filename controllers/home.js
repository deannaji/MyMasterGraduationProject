var  mysql= require("../model/mysqlModel.js"),
     fs= require ("fs");


//routes:

//index
exports.index=function(req){
     res.sendFile(__dirname+ "index.html");
};


//display classes which certain faculty memeber is now teaching:
exports.courses= function(req,res){
   var cwid= req.query.cwid;
   mysql.query("select distinct class.session_id, course.course_code, class.start_date, class.end_date, class.start_time, class.end_time, course.course_name from class join faculty_enrollment on faculty_enrollment.session_id= class.session_id join course on course.course_num= class.course_num where faculty_id=?", [cwid] ,function(err, result){
   if (err){
     console.log(err);
     return;
   }
   res.json(result);
   });
};

//dispaly participants for certain class:
exports.participants=function(req,res){
  var session= req.query.session_id;
  mysql.query("select student.student_cwid, student.first_name, student.last_name from student join enrollment on student.student_cwid= enrollment.student_cwid where enrollment.session_id=?;", [session] ,function(err,result){
     if (err){
       console.log(err);
       return;
     }
    res.json(result);
  });
};


//show grades for certain student:
exports.showgrades=function(req,res){
  var cwid= req.query.cwid,
      session=req.query.session_id;
  mysql.query("select * from grades where student_cwid=? and session_id=?", [cwid,session] ,function(err,result){
     if (err){
       console.log(err);
       return;
     }
    res.json(result);
  });
};

//Add new grade for certain student:
exports.addgrades=function(req,res){
  var gradeType= req.body.gradeType,
      grade=req.body.grade,
      cwid=req.body.cwid;
  mysql.query("update grades set ??=? where student_cwid=?;",[gradeType,grade,cwid],function(err,result){
      if(err){
        console.log(err);
        return;
      }
  });
};

//Delete a grade for certain student and certain subject:
exports.deleteGrade= function(req, res){
  var workType= req.body.workType,
      session_id=req.body.session_id,
      studentID= req.body.student_cwid;
  mysql.query("update grades set ??= null where student_cwid=? and session_id=?;", [workType, studentID, session_id], function(err, result){
      if (err){
        console.log(err);
        return;
      }
      res.json({"status": 200});
  });
};


//Adding a new class:
exports.addClass=function(req, res){
  mysql.query("insert into course(course_name, course_desc, course_code) values(?,?,?)", [req.body.className, req.body.classDescription, req.body.classNum], function(err, result){
     if (err){console.log(err); return;}
     //if succeeded:
     mysql.query("select course_num from course where course_name=? and course_desc=? and course_code=?", [req.body.className, req.body.classDescription, req.body.classNum], function(err, resultContainId){
       if (err){console.log(err); return;}
       //if succeeded:
       var courseId= resultContainId[0].course_num;
       mysql.query("insert into class values(?,?,?,?,?,?)", [req.body.classSessionId, courseId , req.body.startDate, req.body.endDate, req.body.startTime, req.body.endTime], function(err, result){
          if (err){console.log(err); return;}
          //if succeeded:
          mysql.query("insert into faculty_enrollment values(?,?)", [req.body.classSessionId, req.body.faculty_cwid], function(err, result){
             if (err){console.log(err); return;}
             //if succeeded:
             //done!
          });
       });
     });
  });
  res.sendStatus(200);
};



//Deleting a class:
exports.deleteClass= function(req, res){
  var course_num= req.body.courseNum,
      session_id=req.body.sessionId;
  mysql.query("delete from faculty_enrollment where session_id=?", [session_id], function(err, result){
    if(err){console.log(err); return;}
    //if succeeded:
    mysql.query("delete from enrollment where session_id=?", [session_id], function(err, result){
      if(err){console.log(err); return;}
      //if succeeded:
      mysql.query("delete from class_indicators where session_id=?", [session_id], function(err, result){
        if(err){console.log(err); return;}
        //if succeeded:
        mysql.query("delete from grades where session_id=?", [session_id], function(err, result){
          if(err){console.log(err); return;}
          //if succeeded:
          mysql.query("delete from class where session_id=?", [session_id], function(err, result){
            if(err){console.log(err); return;}
            //if succeeded:
            mysql.query("delete from course where course_num=?", [course_num], function(err, result){
              if(err){console.log(err); return;}
              //if succeeded, then done!
            });
          });
        });
      });
    });
  });
  res.json({"status":200});
};
