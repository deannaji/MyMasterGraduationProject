var main = function() {
        $(".addIndicatorContainer").hide();
        $(".setupAssessmentContainer").show();
        $("#classname").text(sessionStorage.getItem("course_num")+" "+sessionStorage.getItem("course_name"));

        var url1 = "http://localhost:3000/assessmentSetup";
        var classSession = sessionStorage.getItem("session_id");

        var indicators = []; //an array of objects containing indicator number, and name
        var indicatorsNamesList=[];
        var gradeTypes= ["Select Student's work type",'term_proj','term_proj2','term_proj3','term_proj4','term_proj5','term_proj6','term_proj7','term_proj8','term_proj9','term_proj10','midterm','final_exam','hw1','hw2','hw3','hw4','hw5','hw6','hw7','hw8','hw9','hw10','hw11','hw12','hw13','hw14','hw15','hw16','hw17','hw18','hw19','hw20'];

        //This is the first ajax req. in the page. It is for getting all indicators for certain class:
        $.ajax({
            type: "GET",
            url: url1,
            data: {
                "session_id": classSession
            },
            success: function(result) {

                if(result.length <= 2){
                   $(".IndicatorsList").css("list-style-type", "none");
                   var $li=$("<li>"),
                       $span1=$("<span>"),
                       $span2=$("<span>");
                   $span1.attr("class", "fa fa-exclamation-triangle");
                   $span1.attr("id","msgIco");
                   $span2.attr("id","msgBody");
                   $span2.text(" There are no assessment indicators for this class yet. Please use 'Add Indicator' button above, to add indicators to this class.");
                   $li.append($span1);
                   $li.append($span2);
                   $(".IndicatorsList").append($li);
                }
                //taking the (uploaded work files) away from the result, as it is not needed here at the moment.
                result.pop(2);
                for (var i=0; i<=result.length-1;i++) {
                    if (i <= result.length-2){
                        //filling the indicators list:
                        indicators.push(result[i]);
                    }
                    else if(i === result.length-1){
                        //filling the indicators names only list:
                        indicatorsNamesList =result[i].slice(0);//copy arrays in JS
                    }
                }

                for (var i = 0; i <= indicators.length -1 ; i++) {
                 var $li = $("<li>");
                 var $select = $("<select>");

                 $li.append(indicators[i].indicator_name);
                 $li.append(" - ");
                 $li.append(indicators[i].type_of_work);

                 var $setupIndicatorButton = $("<button>");
                 $setupIndicatorButton.attr("id", i+1);
                 $setupIndicatorButton.text("Edit Indicator");
                 $(".IndicatorsList").append($li);
                }//End of the bigger for loop


                //show indicator's adding setup pannel:
                    $("li button").on("click", function() {
                        $(".setupAssessmentContainer").hide();
                        $(".addIndicatorContainer").show();
                        $("select.indicatorsSelect").empty();
                        $("select.typeOfWork").empty();

                        var $select = $(".indicatorsSelect");
                        $firstOption = $("<option>");
                        $firstOption.val(0);
                        $firstOption.text("Select an Indicator");
                        $select.append($firstOption);

                        for (var element in indicatorsNamesList) {
                            var $option = $("<option>");
                            $option.val(indicatorsNamesList[element].indicator_name);
                            $option.text(indicatorsNamesList[element].indicator_name);
                            $select.append($option);
                        }

                        for (var element in gradeTypes){
                            var $option= $("<option>");
                            $option.val(gradeTypes[element]);
                            $option.text(gradeTypes[element]);
                            $("select.typeOfWork").append($option);
                        }
                    });

                   //Save Changes button click event:
                    $("#saveChanges").on("click", function(){
                         $("#session_id").val(sessionStorage.getItem("session_id"));
                         $("#indicator").val($(".indicatorsSelect").val());
                         $("#typeofwork").val($(".typeOfWork").val());

                         if($("#indicator").val()===0 || $("#typeofwork").val() ==="Select Student's work type" || $("#satisfactoryFile").val()==="" || $("#developingFile").val()==="" || $("#unsatisfactoryFile").val()===""){
                           alert("Error, missing fields!\n"+"All fields are required.");
                         }else{
                           $("form.uploadForm").submit();
                         }

                    });



                //Go Back, close the indicator's setup pannel:
                    $("#backToAssessmentSetup").on("click", function() {
                        $(".setupAssessmentContainer").show();
                        $(".addIndicatorContainer").hide();
                    });


                //Add new Indicator button click event:
                $("#addIndicator").on("click", function() {
                      //adding a placeholder to an indicator(empty indicator), waiting to be filled with inforamtion when "Save Changes" button is clicked.
                      $("span#msgIco").hide();
                      $("span#msgBody").hide();
                      var $li = $("<li>");
                      $li.append("[indicator name]");
                      $li.append(" - ");
                      $li.append("[type_of_work]");
                      $li.append(" - ");
                      var $setupIndicatorButton = $("<button>");
                      $setupIndicatorButton.attr("id", i + $(".IndicatorsList li").size());
                      $setupIndicatorButton.attr("class", "fa fa-cog");
                      $setupIndicatorButton.text(" Setup Indicator");
                      $li.append($setupIndicatorButton);

                      $(".IndicatorsList").append($li);


                    //show indicator's setup pannel:
                    $("li button").on("click", function() {
                        $(".setupAssessmentContainer").hide();
                        $(".addIndicatorContainer").show();
                        $("select.indicatorsSelect").empty();
                        $("select.typeOfWork").empty();

                        var $select = $(".indicatorsSelect");
                        $firstOption = $("<option>");
                        $firstOption.val(0);
                        $firstOption.text("Select an Indicator");
                        $select.append($firstOption);

                        for (var element in indicatorsNamesList) {
                            var $option = $("<option>");
                            $option.val(indicatorsNamesList[element].indicator_name);
                            $option.text(indicatorsNamesList[element].indicator_name);
                            $select.append($option);
                        }


                        for (var element in gradeTypes){
                            var $option= $("<option>");
                            $option.val(gradeTypes[element]);
                            $option.text(gradeTypes[element]);
                            $("select.typeOfWork").append($option);

                        }
                    });


                    //Go Back, close the indicator's setup pannel:
                    $("#backToAssessmentSetup").on("click", function() {
                        $("#satisfactoryFile").val("");
                        $("#developingFile").val("");
                        $("#unsatisfactoryFile").val("");

                        $(".setupAssessmentContainer").show();
                        $(".addIndicatorContainer").hide();
                    });

                }); //end of Add new Indicator button click event.


                //Back to the main classes page:
                $("#backToClassesPage").on("click", function() {
                    sessionStorage.removeItem("session_id");
                    sessionStorage.removeItem("course_num");
                    sessionStorage.removeItem("course_name");
                    location.href = "faculty.html";
                });


            },
            failure: function(err) {
                alert(err);
            }

        }); //End of 1st get ajax




    } //End of main
$(document).ready(main);
