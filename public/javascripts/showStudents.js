var main = function() {
    //loading page
    var catchingNet = [];
    $(".participants-container").show();
    $(".grades-container").hide();
    $(".addGrades-form").hide();
    $(".addStudentsForm-container").hide();

    var url3 = "http://localhost:3000/participants",
        url4 = "http://localhost:3000/showgrades",
        url5 = "http://localhost:3000/addgrades",
        url6 = "http://localhost:3000/deletegrade";

    //show participants Ajax call:
    var classSession = sessionStorage.getItem("classSession");
    $(".className").text(sessionStorage.getItem("course_num")+" "+ sessionStorage.getItem("course_name"));
    $.ajax({
        data: {
            "session_id": classSession
        },
        url: url3,
        type: "GET",
        success: function(result) {
            if(result.length===0){
              $(".participants-list").css("list-style-type", "none");
              var $li=$("<li>"),
                  $span1=$("<span>"),
                  $span2=$("<span>");
              $span1.attr("class", "fa fa-exclamation-triangle");
              $span2.text(" There are no students enrolled in this class yet. Please use 'Add Students' button above, to add students into this class.");
              $li.append($span1);
              $li.append($span2);
              $(".participants-list").append($li);
            }
            var participantsArray = result;

            participantsArray.forEach(function(element) {
                var studentInfo = element.first_name + "  " + element.last_name + "  ",
                    $li = $("<li>");
                var $buttonDiv= $("<div>");
                var $studentName= $("<span>");
                $studentName.text(studentInfo);
                $buttonDiv.attr("class", "button-container");
                var $gradesButton = $("<button>");
                $gradesButton.text(" Grades");
                $gradesButton.attr("class","fa fa-bar-chart");
                var $span=$("<span>");
                $span.attr("class","tooltiptext");
                $span.text("Add/show grades for this student");
                $buttonDiv.append($gradesButton);
                $buttonDiv.append($span);
                $gradesButton.attr("id", element.student_cwid);

                $li.append($studentName);
                $li.append($buttonDiv);
                $(".participants-list").append($li);


                //Add/Show Grades button click event:
                $gradesButton.on("click", function() {
                  $(".participants-container").hide();
                	$(".grades-container").show();

                    //grabbing the student name from the list of students, to show it on the add grade page:
                    var li=$(this).parent().parent();
                    var liText= $(li[0]).text();
                    var studentName=liText.replace("GradesAdd/show grades for this student","").replace("-","").replace("-","");
                    $(".studentName").text(studentName.trim());

                    var cwid = $(this).attr("id");
                    //This ajax call will bring all the grades ajax req. for a spesific student:
                    $.ajax({
                        data: {
                            "cwid": cwid,
                            "session_id": classSession
                        },
                        url: url4,
                        type: "GET",
                        success: function(result) {
                            var grades = result[0];
                            //looping over the result object to extract grades:
                            var iteration=0;
                            for (var key in grades) {
                                if (grades[key] !== null && key !=="student_cwid" && key !=="session_id") {
                                  if(iteration===0){
                                    $(".grades-table").append("<tr id='first-row'><th>Type of work</th><th>Grade letter</th><th>Delete grade</th></tr>");
                                    iteration++;
                                  }

                                    var $tr=$("<tr>"),
                                        $deleteButton=$("<button>"),
                                        $td1=$("<td>"), $td2=$("<td>"),$td3=$("<td>");
                                    $tr.attr("id", key);
                                    $deleteButton.attr("class", "fa fa-trash");
                                    $deleteButton.attr("id", key);
                                    $td1.text(key);
                                    $td2.text(grades[key]);
                                    $td3.append($deleteButton);

                                    $tr.append($td1);
                                    $tr.append($td2);
                                    $tr.append($td3);

                                    $(".grades-table").append($tr);
                                }//end if.
                            }//end for.

                            //Delete grade button event:
                            $("td button").on("click", function(){
                              if (confirm("Warning: You are about to delete this grade! Click 'OK' to proceed and 'Cancel' to cancel deletion.")) {
                                // if yes, deleting the class:
                                var id= $(this).attr("id"),
                                    session_id= result[0].session_id,
                                    studentID= result[0].student_cwid;
                                $.ajax({
                                    url: url6,
                                    type:"DELETE",
                                    data:{"workType":id, "session_id":session_id, "student_cwid": studentID},
                                    success: function(result){
                                      if(result.status === 200){
                                        var selectorStr="tr#"+id;
                                        $(selectorStr).remove();
                                      }
                                    },
                                    failure: function(err){
                                      console.log(err);
                                    }
                                });//end of ajax req.
                              }
                              else{
                                //do nothing!
                              }
                            });//end of delete grade event.


                            //if the table is empty, i.e. this student doesn't have grades yet:
                            if($(".grades-table tbody").length === 0){
                              $("#message").text(" This student doesn't have grades yet. Please use 'Add a Grade' button bellow to add grades.");
                              $("#message").attr("class", "fa fa-exclamation-triangle");
                            }
                            var $addGrades = $("<button>");
                            $addGrades.text(" Add a Grade");
                            $addGrades.attr("class", "fa fa-plus-square");
                            $(".grades-list").append($addGrades);
                            //my catching net is filtering the cwid's and preventing re ajaxing due to the for loops!
                            catchingNet.pop();
                            catchingNet.push(result[0].student_cwid);

                            //Adding grades event handling:
                            $addGrades.on("click", function() {
                                $(".gradeInputBox").val("");
                                $(".available-dropdownlist").val("");
                                $(".available-dropdownlist").empty();
                                $(".available-dropdownlist").prepend("<option value='' disabled selected> Select grade letter</option>");

                                var availableGradeType = [];
                                for (var key in grades) {
                                    if (grades[key] === null) {
                                        availableGradeType.push(key);
                                    }
                                }
                                $(".grades-container").hide();
                                $(".addGrades-form").show();

                                for (var item in availableGradeType) {
                                    var $option = $("<option>");
                                    $option.attr("value", availableGradeType[item]);
                                    $option.text(availableGradeType[item]);
                                    $(".available-dropdownlist").append($option);
                                }
                            });//End of AddGrades-form button click

                            //Back to show students pannel:
                            $("#back-to-students").on("click", function(){
                                 $(".grades-list").empty();
                                 $(".grades-table").empty();
                                 $("#message").text("");
                                 $("#message").attr("class","");
                                 location.reload();
                                 $(".grades-container").hide();
                                 $(".participants-container").show();
                            });

                            //Confirm adding event handling:
                            $("#confirmAddingButton").on("click", function() {
                                var studentId = catchingNet[0];
                                var grade = $(".gradeInputBox").val();
                                var gradeType = $(".available-dropdownlist").val();

                                if (grade === "" || gradeType === null) {
                                    alert("You have missing values!"+"\n"+"Please fill all fields..");
                                } else if (grade !== "" && gradeType !== null) {
                                    $.ajax({
                                        data: {
                                            "gradeType": gradeType,
                                            "grade": grade,
                                            "cwid": studentId
                                        },
                                        url: url5,
                                        type: "POST",
                                        success: function(result) {
                                        },
                                        failure: function(err) {
                                            console.log(err);
                                        }
                                    });
                                    //updating the view with the new grade:
                                    for (element in grades){
                                      if (element=== gradeType){
                                         grades[element]=grade;
                                      }
                                    }
                                    $(".addGrades-form").hide();
                                    $(".grades-container").show();
                                    $("#message").text("");
                                    $("#message").attr("class","");

                                    if($("tbody tr").length === 0){
                                    var $tr=$("<tr>"),
                                        $tr1=$("<tr>"),//the header of the table
                                        $deleteButton=$("<button>"),
                                        $td1=$("<td>"), $td2=$("<td>"),$td3=$("<td>");
                                    //creating table header:
                                    var $tdHead1=$("<th>"),
                                        $tdHead2=$("<th>"),
                                        $tdHead3=$("<th>");
                                    $tdHead1.text("Type of work");
                                    $tr1.append($tdHead1);
                                    $tdHead2.text("Grade letter");
                                    $tr1.append($tdHead2);
                                    $tdHead3.text("Delete grade");
                                    $tr1.append($tdHead3);
                                    //End of table header..

                                    $tr.attr("id",gradeType);
                                    $deleteButton.attr("class", "fa fa-trash");
                                    $deleteButton.attr("id", gradeType);
                                    $td1.text(gradeType);
                                    $td2.text(grade);
                                    $td3.append($deleteButton);
                                    $tr.append($td1);
                                    $tr.append($td2);
                                    $tr.append($td3);
                                    $(".grades-table").append($tr1);
                                    $(".grades-table").append($tr);

                                  }else{
                                    var $tr=$("<tr>"),
                                        $deleteButton=$("<button>"),
                                        $td1=$("<td>"), $td2=$("<td>"),$td3=$("<td>");
                                    $tr.attr("id",gradeType);
                                    $deleteButton.attr("class", "fa fa-trash");
                                    $deleteButton.attr("id", gradeType);
                                    $td1.text(gradeType);
                                    $td2.text(grade);
                                    $td3.append($deleteButton);
                                    $tr.append($td1);
                                    $tr.append($td2);
                                    $tr.append($td3);
                                    $(".grades-table").append($tr);
                                  }//end else
                                } //end of if/else block.
                            }); //end of adding grades event.

                            //Cancel adding grade button:
                            $("#cancelAdding").on("click", function() {
                                console.log("canceling adding!");
                                $(".gradeInputBox").val("");
                                $(".available-dropdownlist").val("");
                                cwid = "";
                                $(".addGrades-form").hide();
                                $(".grades-container").show();
                            });

                        },
                        failure: function(err) {
                            alert(err);
                        }
                    }); //end of show grades ajax req.
                }); //end of gradesButton event.
            });


        //Uploading students using CSV file event:
            //Showing the uploading form:
            $("#addStudents").on("click", function(){
                $(".participants-container").hide();
                $(".addStudentsForm-container").show();

            });
            //Cancelling the uploading form:
            $("#cancelUploadStudentsFile").on("click", function(){
                $(".addStudentsForm-container").hide();
                $(".participants-container").show();
            });

            //Clicking the upload button:
            $("#uploadStudentsFile").on("click", function(){
                console.log("uploading...");
                $("#session_id").val(sessionStorage.getItem("classSession"));
                if($("#studentsFile").val() ===""){
                    alert("Error, no file selected!");
                }else{
                  $("form.addStudentsForm").submit();
                }

            });//end of students CSV file upload event.


            //Go back button event:
            $("#back-to-classes").on("click", function() {
                sessionStorage.removeItem("classSession");
                sessionStorage.removeItem("course_name");
                sessionStorage.removeItem("course_num");
                location.href = "./faculty.html";
            });

        },
        failure: function(err) {
            alert(err);
        }
    });




}; //end of main
$("document").ready(main);
