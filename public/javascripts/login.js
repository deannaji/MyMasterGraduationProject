var main=function(){
    var url="http://localhost:3000/login";
    $("#login-button").on("click", function(){
       var $username= $("#username").val(),
           $password= $("#password").val();
       $.ajax({url,
               data: {"username": $username, "password": $password},
               type: "GET",
               success: function(result){
                 console.log(result);
                 if (result.status === "valid"){
                    //alert("Welcome "+$username);
                    $("#username").val("");
                    $("#password").val("");
                    var user=result;
                    sessionStorage.setItem("username", $username);
                    sessionStorage.setItem("password", $password);
                    sessionStorage.setItem("id", user.id);
                    sessionStorage.setItem("first_name", result.first_name);
                    sessionStorage.setItem("last_name", result.last_name);
                    sessionStorage.setItem("email", result.email);
                    sessionStorage.setItem("role", result.role);

                    if(result.role === "faculty"){
                       location.href= "./faculty.html";
                    }
                    else if(result.role === "admin"){
                       location.href= "./admin.html";
                    }
                    else{
                       alert("Invalid role detected!, roles should be"+"\n"+"either faculty, or admin.");
                    }

                 }
                 else if(result.status==="invalid"){
                    alert("Opps, wrong username or password,"+"\n"+"please try again!");
                    $("#username").val("");
                    $("#password").val("");
                 }
               },
               failure: function(err){
                 alert(err);
               }
             });
    });
};
$("document").ready(main);
