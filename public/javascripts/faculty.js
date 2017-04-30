var main= function(){
   if(sessionStorage.length === 0){
     location.href="/login.html";
   }
   //alert("Welcome faculty member!");
   //loading page
   $(".addClass-form").hide();
   $(".classes-container").show();

   //Getting the lastname & making the first letter upper case, then present the user lastname in the welcome line:
   var nameStr= sessionStorage.getItem("last_name");
   var usernameUpper="";
   usernameUpper += nameStr[0].toUpperCase();
   for(var i=1; i<= nameStr.length-1;i++){
      usernameUpper += nameStr[i];
   }
   $(".username").text(usernameUpper);


   var url1="http://localhost:3000/classes",
       url2="http://localhost:3000/addclass",
       url3="http://localhost:3000/deleteclass",
       classes=[],
       cwid=sessionStorage.getItem("id");


   //show faculty's classes ajax request:
   $.ajax({
          data: {"cwid": cwid},
          url: url1,
          type:"GET",
          success:function(result){
             for(var element in result){
               classes.push(result[element]);
             }

             classesArray=[];//an array of objects to hold all classes.

             classes.forEach(function(element){
             	//classObj represents a single course object
             	 var classObj={sessionId: element.session_id, courseNum: element.course_code, courseName: element.course_name};
             	 classesArray.push(classObj);
                 var startDate= element.start_date.substring(0,10),
                     endDate= element.end_date.substring(0,10);

                 var $li=$("<li>");
                 var courseText=element.course_code + " - " + element.course_name;
                 var $p=$("<p>");
                 var $span=$("<span>");
                 $span.text("  from "+startDate+" - "+endDate);
                 $span.attr("class","classDate");
                 var $courseDiv= $("<div>");
                 $p.text(courseText);
                 $courseDiv.attr("id", element.session_id);
                 $courseDiv.attr("class", "course-container");

                 var $reportbutton=$("<button>");
                 $reportbutton.text(" Visualize Students Work");
                 $reportbutton.attr("class","fa fa-television");
                 $reportbutton.attr("id",element.session_id);

                 var $participantsButton=$("<button>");
                 $participantsButton.text(" Show/Add Students");
                 $participantsButton.attr("class","fa fa-users");
                 $participantsButton.attr("id",element.session_id);

                 var $setupAssessmentButton=$("<button>");
                 $setupAssessmentButton.text(" Setup Assessment");
                 $setupAssessmentButton.attr("class","fa fa-cog");
                 $setupAssessmentButton.attr("id",element.session_id);

                 var $deleteButton=$("<button>");
                 $deleteButton.text(" Delete This Class");
                 $deleteButton.attr("id", element.session_id);
                 $deleteButton.attr("class", "fa fa-trash");
                 $deleteButton.hide();

                 $li.attr("id", element.session_id);
                 $p.append($span);
                 $courseDiv.append($p);
                 $courseDiv.append($reportbutton);
                 $courseDiv.append($participantsButton);
                 $courseDiv.append($setupAssessmentButton);
                 $courseDiv.append($deleteButton);
                 $li.append($courseDiv);
                 $(".main-list").prepend($li);


                 //show participants Button click event:
                 $participantsButton.on("click", function(){
                    var elementId= $(this).attr("id");
                      var classObj;
                      for( var i in classesArray){
                        var tempObj= classesArray[i];
                        if(parseInt(tempObj.sessionId) === parseInt(elementId)){
                          classObj=tempObj;
                        }
                      }

                    sessionStorage.setItem("classSession", classObj.sessionId);
                    sessionStorage.setItem("course_num", classObj.courseNum);
                    sessionStorage.setItem("course_name", classObj.courseName);

                    location.href = "./showStudents.html";

                 })//end of display participants event.





                 //display assessment report button event:
                 $reportbutton.on("click", function(){
                      var elementId= $(this).attr("id");
                      var classObj;
                      for( var i in classesArray){
                        var tempObj= classesArray[i];
                        if(parseInt(tempObj.sessionId) === parseInt(elementId)){
                          classObj=tempObj;
                        }
                      }

                      sessionStorage.setItem("classSession", classObj.sessionId);
                      sessionStorage.setItem("course_num", classObj.courseNum);
                      sessionStorage.setItem("course_name", classObj.courseName);
                      sessionStorage.setItem("classStartDate", startDate);
                      sessionStorage.setItem("classEndDate", endDate);
                      sessionStorage.setItem("role", "faculty");

                      location.href = "./assessmentReport-admin.html";

                 });//end of reportbutton click event.




                //Setup Assessment Button click event:
                $setupAssessmentButton.on("click", function(){
                	$id= $(this).attr("id");
                    var elementId= $(this).attr("id");
                      var classObj;
                      for( var i in classesArray){
                        var tempObj= classesArray[i];
                        if(parseInt(tempObj.sessionId) === parseInt(elementId)){
                          classObj=tempObj;
                        }
                      }

                    sessionStorage.setItem("session_id", classObj.sessionId);
                    sessionStorage.setItem("course_num", classObj.courseNum);
                    sessionStorage.setItem("course_name", classObj.courseName);

                	location.href= "./setupAssessment.html";
                });

             });//end of the first ajax forEach loop.


             //Delete class button event:
             $(".main-list li div button:nth-child(5)").on("click", function(){
               if (confirm("Warning: You are about to delete this class, all the related data like: students, grades, and indicators will be lost forever!. Click 'OK' to proceed and 'Cancel' to cancel deletion.")) {
                 // if yes, deleting the class
                 //Getting this class data, and put it in a temp obj. called classObj:
                 var elementId= $(this).attr("id");
                   var classObj;//= classesArray[$(this).attr("id") -1];
                   for( var i in classesArray){
                     var tempObj= classesArray[i];
                     if(parseInt(tempObj.sessionId) === parseInt(elementId)){
                       classObj=tempObj;
                     }
                   }
                   var courseNum= classObj.courseNum,
                       sessionId= classObj.sessionId;
                   $.ajax({
                     url: url3,
                     type: "DELETE",
                     data: {"courseNum": courseNum, "sessionId": sessionId},
                     success: function(result){
                       if(result.status === 200){
                         location.reload();
                       }
                     },
                     failure: function(err){
                       console.log(err);
                     }
                   });//end of ajax.
               } else {
                 // Do not delete the class.
               }

             });//end of delete class event.




             //UI Decorations(black border around hovered on class, and the delete class button)""
             $(".main-list li").hover (function(){
                var id=$(this).attr("id");
                $(this).css("border-color","black");
                var selector=".main-list li div#"+id+" button:nth-child(5)";
                $(selector).show();

             }, function(){
                var id=$(this).attr("id");
                var selector=".main-list li div#"+id+" button:nth-child(5)";
                $(selector).hide();
                $(this).css("border-color","transparent");
             });

             $("#logout-button").hover(function(){
                $(this).css("text-decoration", "underline");
             }, function(){
                $(this).css("text-decoration", "none");
             });

             $(".username").hover(function(){
                $(this).css("text-decoration", "underline");
             }, function(){
                $(this).css("text-decoration", "none");
             });//End of Decorations.
          },
          failure:function(err){
             alert(err);
          }
   });//end of main ajax, for bringing all classes.

//show the form for adding new class:
$("#addClass").on("click", function(){
      $(".classes-container").hide();
      $("header").hide();
      $("footer").hide();
      $(".header-container").hide();
      $(".addClass-form").show();
});

//cancel adding new class, hides the adding form.
$("#cancelAdding").on("click", function(){
    $(".addClass-form").hide();
    $("header").show();
    $("footer").show();
    $(".header-container").show();
    $(".classes-container").show();
});

//Adding a new class event:
$("#addClassButton").on("click", function(){
    var $classSessionId= $(".classSessionId").val(),
        $className= $(".className").val(),
        $classNum= $(".classNum").val(),
        $classDescription= $(".classDescription").val(),
        $startDate= $(".startDate").val(),
        $endDate= $(".endDate").val(),
        $startTime= $(".startTime").val(),
        $endTime= $(".endTime").val();

    if($classSessionId ==="" || $className==="" || $classNum==="" || $classDescription==="" || $startDate==="" || $startTime==="" || $endDate==="" || $endTime===""){
      alert("Error, missing fields!\n"+"All fields are required.");
    }else{
      $.ajax({
        url: url2,
        type: "POST",
        data: {"classSessionId": $classSessionId,
               "className": $className,
               "classNum": $classNum,
               "classDescription": $classDescription,
               "startDate": $startDate,
               "endDate": $endDate,
               "startTime": $startTime,
               "endTime": $endTime,
               "faculty_cwid": sessionStorage.getItem("id")
              },
        success: function(result){
          location.href= "./faculty.html";
        },
        falure: function(err){console.log(err);}
      });
   }//end else.
});

$("#logout-button").on("click", function(){
   sessionStorage.clear();
   location.href= "./index.html";
});

$(".username").on("click", function(){
   location.href= "./userAccount.html";
});

};//end of main

$("document").ready(main);
