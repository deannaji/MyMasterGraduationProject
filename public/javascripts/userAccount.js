var main= function(){
  $(".pwd-change-container").hide();
  var username=sessionStorage.getItem("username"),
      email=sessionStorage.getItem("email");
  $(".uname").text(username);
  $(".email").text(email);

  //Click on password change text event:
  $("#pwdchange").on("click", function(){
       $(".pwd-change-container").show();
  });

  //Save password event:
  $("#savepwd").on("click", function(){
     var oldpwd = $("#oldpwd").val(),
         newpwd = $("#newpwd").val();
     //Change pwd ajax:
     $.ajax({
       data:{oldpassword: oldpwd, newpassword: newpwd, username: username},
       url:"http://localhost:3000/chgpwd",
       type: "POST",
       success: function(result){
           if(result.status===200){
             alert("Password changed successfully!");
           }else{
             alert("Oops, an error happend. Please try again later.");
           }
           $("#oldpwd").val("");
           $("#newpwd").val("");
           $(".pwd-change-container").hide();
        },
       failure: function(err){
         console.log(err);
       }
     });//End of change pwd ajax.
  });

  //Cancel password change:
  $("#cancelpwd").on("click", function(){
     $("#oldpwd").val("");
     $("#newpwd").val("");
     $(".pwd-change-container").hide();
  });

  //Back to classes:
  $("#backToClasses").on("click", function(){
    if (sessionStorage.getItem("role")==="faculty"){
       location.href= "./faculty.html";
    }else if(sessionStorage.getItem("role")==="admin"){
       location.href= "./admin.html";
    }else{
      location.href= "./login.html";
    }
  });
}//End of main.

$("document").ready(main);
