var  //users= require("../model/mongoModel.js"),
     mysql= require("../model/mysqlModel.js"),
     fs= require ("fs");

//Show all classes for all faculty:
exports.showClasses= function(req, res){
   var user_id= req.query.user_id;
   sql1=" select class.*, course.course_code, course.course_name, faculty.first_name, faculty.last_name from class join course on class.course_num= course.course_num join faculty_enrollment on class.session_id = faculty_enrollment.session_id, faculty where faculty.faculty_id = faculty_enrollment.faculty_id;";
   mysql.query(sql1, function(err, result){
      if(err){
      	console.log(err);
        return;
      }
      res.json({"classes": result});
   });
};

//Download indicator work file:
exports.getFile= function(req, res){
//satisfactory file query:
  var filename= req.query.filename;
  var sql="select * from files where file_name=?";
  mysql.query(sql, [filename],function(err, result){
    if(err){console.log(err); return;}
    console.log("Downloading...");
    res.writeHead(200,{
      'Content-Type': 'application/force-download',
      'Content-disposition':'attachment; filename='+result[0].file_name});
    res.end(result[0].content);
    //res.download(result);
  });
};
