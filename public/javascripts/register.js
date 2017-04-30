var main= function(){

   $("#register-button").on("click", function(){
       //console.log("register...");
       var url1="http://localhost:3000/register";
       var firstName= $("#firstName").val(),
           lastName= $("#lastName").val(),
           username= $("#username").val(),
           password= $("#password").val(),
           email= $("#email").val();
      if(firstName==="" || lastName==="" || username==="" || password==="" || email===""){
        alert ("Error, missing fields!\n"+"All fields are required.");
      }else{
       $.ajax({
       	  url: url1,
          type: "POST",
          data: {"firstName": firstName,
                 "lastName": lastName,
                 "username": username,
                 "password": password,
                 "email": email
                },
          success: function(result){
               console.log(result);
               if (result.status ==="success"){
                    alert("Thanks for registration. You are being redirected to the login page. Please use your new username & password to login!");
                    location.href= "./login.html";
               }else{
               	 alert("Error: Register failed, please retry with differet information!");
               }
          },
          failure: function(err){console.log(err);}
       });
     }//end else.
   });

};
$("document").ready(main);
