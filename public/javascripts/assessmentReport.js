var main= function(){
   //alert("Welcome faculty member!");
   //loading page
   console.log(sessionStorage);
    var assessmentArray=[], indicators=[];

   var url2="http://localhost:3000/assessment",
       url3="http://localhost:3000/assessmentSetup",
       assessmentScale={total:0, satisfactory:0, developing:0, unsatisfactory:0},
       cwid=sessionStorage.getItem("id");
       //adding class name to the title of the assessment report page
       $(".className").text(sessionStorage.getItem("course_num")+" "+ sessionStorage.getItem("course_name"));

                 //display assessment report Ajax call:
                      var classSession= sessionStorage.getItem("classSession");
                      $.ajax({
                          data: {"session_id": classSession},
                          url: url2,
                          type: "GET",
                          success: function(result){

                              //display assessment report function call:
                               if(result.length !== 0){
                                 displayAssessmentReport(result);
                               }

                               //getting all indicators for this class session:
                               $.ajax({
                                  data: {"session_id": classSession},
                                  url: url3,
                                  type: "GET",
                                  success: function(result){
                                      var files=result.pop(2);
                                      for (var i=0; i<=result.length-1;i++) {
                                          if (i <= result.length-2){
                                             //filling the indicators list:
                                             indicators.push(result[i]);
                                          }
                                      }
                                   for (var element in indicators){
                                       var $tableRow= $("<tr>"),
                                           $tableDataName= $("<td>"),
                                           $tableDataType= $("<td>");
                                       $tableDataName.text(indicators[element].indicator_name);
                                       $tableDataType.text(indicators[element].type_of_work);
                                       $tableRow.append($tableDataName);
                                       $tableRow.append($tableDataType);
                                       $(".indicators-table").append($tableRow);
                                   }

                                  },
                                  failure: function(err){console.log(err);}
                               });//end of the indicators ajax req.

                               //Download Assessment Report:
                               $(".downloadAssessmentReport").on("click", function(){
                                  var firstName= sessionStorage.getItem("first_name"),
                                      lastName= sessionStorage.getItem("last_name"),
                                      classTitle= sessionStorage.getItem("course_num")+" "+sessionStorage.getItem("course_name"),
                                      classDate= sessionStorage.getItem("classStartDate")+" - "+sessionStorage.getItem("classEndDate");

                                  $.ajax({
                                    url:"http://localhost:3000/topdfpage",
                                    type:"GET",
                                    data:{"assessmentReport": assessmentArray,
                                          "indicatorsList": indicators,
                                          "firstName": firstName,
                                          "lastName": lastName,
                                          "classTitle": classTitle,
                                          "classDate": classDate
                                         },
                                    success: function(result){
                                       window.open('http://localhost:3000/getpdf');
                                    },
                                    failure: function(err){console.log(err);}
                                  });
                               });


                               //Go back button event:
                               $(".back-to-classes").on("click", function(){
                                    sessionStorage.removeItem("classSession");
                                    sessionStorage.removeItem("course_num");
                                    sessionStorage.removeItem("course_name");
                                    sessionStorage.removeItem("classStartDate");
                                    sessionStorage.removeItem("classEndDate");
                                    location.href = "./faculty.html";
                               });
                          },//end of success.
                          failure: function(err){
                             alert(err);
                          }
                      });//end of assessment report GET ajax.





//This function consumens the ajax call result as an input, and it displays the assessment report for certain class. it also inculde a call for the scale() function.
function displayAssessmentReport(result){
  var keys=Object.keys(result[0]);

  //tempArray is used to store one type of grade (hw,exam,or proj) at a time:
  var tempArray=[];

 //outter for is to loop on the keys that are available in each student object,
 //i.e gives one grade type at a time.
  for (var i=0; i<=keys.length-1; i++){

    //the inside foreach loops on all students.
    result.forEach(function(element){
      if (element[keys[i]] !== null){
        tempArray.push(element[keys[i]]);
      }
    });

   //if it is not an empty array then scale it and update the view.
   if(tempArray.length > 0){
     //scale one grade type at a time:
     scale(tempArray);

     //re empty the tempArray for the next iteration.
     tempArray=[];

     //Updating the View:
     var $tr=$("<tr class='assessment-report'>"), $th=$("<th>"), $tdT=$("<td>"), $tdAB=$("<td>"), $tdC=$("<td>"), $tdDF=$("<td>");

     //appending table data tags to a table row.
     $th.text(keys[i]);
     $tr.append($th);
     $tdT.text(assessmentScale.total);
     $tr.append($tdT);
     $tdAB.text(assessmentScale.satisfactory);
     $tr.append($tdAB);
     $tdC.text(assessmentScale.developing);
     $tr.append($tdC);
     $tdDF.text(assessmentScale.unsatisfactory);
     $tr.append($tdDF);

     //populating download obj and array with data, this data is sent to the server when generating pdf report.
     var assessmentObj={workType:"", totalNum:"", satisfactory:"", developing:"", unsatisfactory:""};
     assessmentObj.workType= keys[i];
     assessmentObj.totalNum= assessmentScale.total;
     assessmentObj.satisfactory= assessmentScale.satisfactory;
     assessmentObj.developing= assessmentScale.developing;
     assessmentObj.unsatisfactory= assessmentScale.unsatisfactory;
     assessmentArray.push(assessmentObj);

     //appending the table row to the whole table.
     $(".assessment-report-table").append($tr);
   }//end if
 }//end of outter for.
}//end of displayAssessmentReport function.





//The scale function is to populate the scale object with groupes of grade levels for each assignment.
// i.e. transform A,B,C grades into excellent,good,average:
function scale(array){
  assessmentScale.total=0;
  assessmentScale.satisfactory=0;
  assessmentScale.developing=0;
  assessmentScale.unsatisfactory=0;

  for(var i=0; i<=array.length-1;i++){
    switch(array[i]){
      case "A":
       assessmentScale.satisfactory++;
       assessmentScale.total++;
       break;
      case "B":
       assessmentScale.satisfactory++;
       assessmentScale.total++;
       break;
      case "C":
      assessmentScale.developing++;
       assessmentScale.total++;
       break;
      case "D":
       assessmentScale.unsatisfactory++;
       assessmentScale.total++;
       break;
      case "F":
        assessmentScale.unsatisfactory++;
        assessmentScale.total++;
        break;
    }
  }
}//end of scale function.

$("#logout-button").on("click", function(){
   sessionStorage.clear();
   location.href= "./index.html";
 });

};//end of main

$("document").ready(main);
