var  mysql= require("../model/mysqlModel.js"),
     htmlToPdf = require('html-to-pdf'),
     phantom = require('phantom'),
     fs= require ("fs");
var path = require('path');
var mime = require('mime');

var webpage = require('webpage');

//routes:


//display assessment report for certain class:
exports.generateAssessment=function(req,res){
   var session=req.query.session_id;
   mysql.query("select grades.hw1,grades.hw2,grades.hw3,grades.hw4,grades.hw5,grades.hw6,grades.hw7,grades.hw8,grades.hw9,grades.hw10,grades.hw11,grades.hw12,grades.hw13,grades.hw14,grades.hw15,grades.hw16,grades.hw17,grades.hw18,grades.hw19,grades.hw20,grades.term_proj,grades.term_proj2,grades.term_proj3,grades.term_proj4,grades.term_proj5,grades.term_proj6,grades.term_proj7,grades.term_proj8,grades.term_proj9,grades.term_proj10,grades.exam1,grades.midterm,grades.final_exam  from grades join class on grades.session_id= class.session_id where grades.session_id=?",[session] ,function(err,result){
       if(err){
         console.log(err);
         return;
       }
       res.json(result);
   });
};


//Show all assessment indicators for certain class:
exports.assessmentSetup=function(req,res){
	var session= req.query.session_id;
  mysql.query("select class_indicators.indicator_id, class_indicators.type_of_work, indicators.indicator_name from class_indicators join indicators on class_indicators.indicator_id= indicators.indicator_id where class_indicators.session_id=?;",[session],function(err, result1){
	   if(err){
         console.log(err);
         return;
       }
       mysql.query("select indicator_name from indicators order by indicator_name asc",function(err,result2){
           mysql.query("select class_indicators.session_id, files.file_name from class_indicators, files where files.file_id in (class_indicators.satisfactory, class_indicators.developing, class_indicators.unsatisfactory) and class_indicators.session_id =?",[session], function(err, result3){
               if(err){
                console.log(err);
                return;
               }
               result1.push(result2);
               result1.push(result3);
               res.json(result1);
           });
       });

	});
};


//upload indicator file(save the file to the database):
exports.uploadIndicatorWork= function(req,res){
    //get a handle on the three uploaded files:
    var satisfactory= req.files['satisfactory'][0],
        developing = req.files['developing'][0],
        unsatisfactory= req.files['unsatisfactory'][0];
    //insert satisfactory work file:
    mysql.query("insert into files (content,file_name,file_size,mimetype) values(?,?,?,?)",[satisfactory.buffer, satisfactory.originalname, satisfactory.size, satisfactory.mimetype],function(err,result){
       if(err){
          console.log(err);
          return;
       }//on success:
       //insert developing work file:
       mysql.query("insert into files (content,file_name,file_size,mimetype) values(?,?,?,?)",[developing.buffer, developing.originalname, developing.size, developing.mimetype],function(err,result){
              if(err){
                 console.log(err);
                 return;
              }//on success:
              //insert unsatisfactory work file:
              mysql.query("insert into files (content,file_name,file_size,mimetype) values(?,?,?,?)",[unsatisfactory.buffer, unsatisfactory.originalname, unsatisfactory.size, unsatisfactory.mimetype],function(err,result){
                   if(err){
                      console.log(err);
                      return;
                   }//on success:
                   mysql.query("select file_id from files where file_name in (?,?,?)", [satisfactory.originalname, developing.originalname, unsatisfactory.originalname], function (err, result) {
                     if(err){
                       console.log(err);
                       return;
                     }
                      var file1Id = result[0].file_id,
                          file2Id = result[1].file_id,
                          file3Id = result[2].file_id,
                          indicator_id;
                      mysql.query("select indicator_id from indicators where indicator_name= ? ", [req.body.indicator] ,function(err, result){
                           if (err){
                             console.log(err);
                             return;
                           }
                           indicator_id= result[0].indicator_id;
                           console.log(indicator_id);
                           mysql.query("insert into class_indicators (session_id, indicator_id, type_of_work, satisfactory, developing, unsatisfactory) values(?,?,?,?,?,?)",[req.body.session_id, indicator_id , req.body.typeofwork, file1Id, file2Id, file3Id],function(err, result){
                              if(err){
                                console.log(err);
                                return;
                              }

                           });

                      });


                   });
              });//end of unsatisfactory file insert
       });//end of developing file insert query.
          res.redirect("/faculty.html");
    });//end of satisfactory file insert query.
};//End of upload indicator request.


//Assessment Report html to pdf:
exports.pdfy= function(req, res){
    var classIdCard="Instructor: "+req.query.firstName+" "+req.query.lastName+"<br>"+"Class: "+req.query.classTitle+"<br>"+"Date: "+req.query.classDate;
    var pageStr= getPage(req.query.indicatorsList, req.query.assessmentReport, classIdCard);
    phantom.create().then(function(ph) {
      ph.createPage().then(function(page) {
        page.open("http://localhost:3000/assessmentReport.html").then(function(status) {
             //page.property('viewportSize',{width: 1920, height: 1080});
             page.property('content', pageStr);
             page.property('paperSize', {format: 'A4', orientation: 'portrait'});
             page.render('downloads/AssessmentReport.pdf').then(function() {
                console.log('Page Rendered');
                console.log("Downloading...");
                ph.exit();
                res.sendStatus(200);
             });
        });
      });
    });
};

exports.getPdf=function(req, res){
  res.download("/home/vagrant/MyGradProjApp/downloads/AssessmentReport.pdf");
};



function getPage(indicArray, assessArray, classIdCard){
    var page="";
    var pageHeader= "<html><style> table, th, td {border: 1px solid black; border-collapse: collapse;} "+
                    "div {margin-left: 10%; margin-right: 10%} th{font-size: 12px;}</style>"+"<div class='assessment-report'>"+"<br>"+"<h2>Assessment Report</h2>"+
                    classIdCard+"<br><br>";
    var tableTail="</tbody>"+"</table>";
    var pageFooter="</div></html>";

    //building Assessment table:
    var assessmentTableHeadStr="<table>"+
            "<tbody>"+
            "<tr><th></th><th>Total assessed</th><th>Satisfactory</th><th>Developing</th><th>Unsatisfactory</th></tr>";
    var assessmentTableBody="";
    for(var element in assessArray){
        assessmentTableBody= assessmentTableBody+ "<tr><th>"+assessArray[element].workType+"</th><td>"+assessArray[element].totalNum+
                             "</td>"+"<td>"+assessArray[element].satisfactory+"</td>"+"<td>"+assessArray[element].developing+"</td>"+"<td>"+assessArray[element].unsatisfactory+"</td>"+"</tr>";
    }


    //building indicators table:
    var indcatorTableHeadStr="<table>"+
            "<tbody>"+
            "<tr><th>Indicator</th><th>Type of work</th></tr>";
    var indicatorTableBody="";
    for(var element in indicArray){
        indicatorTableBody= indicatorTableBody+ "<tr><td>"+indicArray[element].indicator_name+"</td><td>"+indicArray[element].type_of_work+"</td></tr>";
    }


    //building the full report page:
    page= pageHeader +"<h4>Class Assessment Table:</h4>"+assessmentTableHeadStr+assessmentTableBody+tableTail+"<br><br>"+"<h4>Class Assessment Indicators:</h4>"+indcatorTableHeadStr+ indicatorTableBody+ tableTail+ pageFooter;
    return page;
}
