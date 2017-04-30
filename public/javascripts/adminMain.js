var main= function(){
  if(sessionStorage.length === 0){
    location.href="/login.html";
  }
 //alert("Welcome Admin!");
 var user={};
 console.log(sessionStorage);
 user.username= sessionStorage.getItem("username");
 user.password= sessionStorage.getItem("password");
 user.id= sessionStorage.getItem("id");
 var url1="http://localhost:3000/adminclasses";

 $.ajax({
    url: url1,
    type: "GET",
    data: {"user_id": user.id},
    success: function(result){
        console.log(result);
        //allClassess is an array of all classes and its details.
        var allClasses=result.classes;
        for(var element in allClasses){
          var startDate= allClasses[element].start_date.substring(0,10),
              endDate= allClasses[element].end_date.substring(0,10);

        	var $li= $("<li>"),
        	    $h= $("<h3>");
        	$h.attr("id", allClasses[element].session_id);
        	$h.attr("class", "courses");
        	$h.attr("style","cursor:pointer");
        	$h.text(allClasses[element].course_code +" "+allClasses[element].course_name+" from "+startDate+" - "+endDate);
        	$li.append($h);
        	$("ul.classes-list").prepend($li);
        }

        //Click on a certain class:
        $("h3.courses").on("click", function(){
           var classObj;
           for(var element in allClasses){
           	 if(allClasses[element].session_id.toString() === this.id){
           	 	classObj=allClasses[element];
           	 }
           }
           sessionStorage.setItem("classSession", classObj.session_id);
           sessionStorage.setItem("course_num", classObj.course_code);
           sessionStorage.setItem("course_name", classObj.course_name);
           sessionStorage.setItem("classStartDate", startDate);
           sessionStorage.setItem("classEndDate", endDate);
           sessionStorage.setItem("role", "admin");
           sessionStorage.setItem("first_name", classObj.first_name);
           sessionStorage.setItem("last_name", classObj.last_name);
           location.href = "./assessmentReport-admin.html";
        });
        //UI Decorations
        $(".classes-list li").hover (function(){
           $(this).css("border-color","black");
        }, function(){
           $(this).css("border-color","transparent");
        });

        $("#logOutButton").hover(function(){
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
    failure: function(err){console.log(err);}
 });

 $(".username").on("click", function(){
    location.href= "./userAccount.html";
 });

 $("#logOutButton").on("click", function(){
   sessionStorage.clear();
   location.href= "./index.html";
 });

};//End of main.
$("document").ready(main);
