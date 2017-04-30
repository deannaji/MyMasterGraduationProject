var express= require("express"),
    app=express(),
    http= require("http").createServer(app),
    bodyParser= require("body-parser"),
    home= require("./controllers/home.js"),
    users= require("./controllers/users.js"),
    assessment= require("./controllers/assessment.js"),
    students= require("./controllers/students.js"),
    admin= require("./controllers/admin.js"),
    fs= require("fs");

 //file uploader(Multer):
 var multer  = require('multer'),
     storage= multer.memoryStorage(),
     upload = multer({ storage: storage});


app.use(express.static(__dirname+ "/views"));
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes:
//index:
app.get("/", home.index);

//Users:
app.get("/login", users.login);
app.post("/register", users.register);
app.post("/chgpwd", users.changePwd);

//Classess & Students:
app.get("/classes", home.courses);
app.get("/participants", home.participants);
app.get("/showgrades", home.showgrades);
app.post("/addgrades", home.addgrades);
app.delete("/deletegrade", home.deleteGrade);
app.post("/addclass", home.addClass);
app.delete("/deleteclass", home.deleteClass);
app.post("/addstudents", upload.single("studentsFile"),students.addStudents);

//Assessment:
app.get("/assessment", assessment.generateAssessment);
app.get("/assessmentSetup", assessment.assessmentSetup);
app.post("/uploadIndicatorWork", upload.fields([{ name: 'satisfactory', maxCount: 1 }, { name: 'developing', maxCount: 1 }, { name: 'unsatisfactory', maxCount: 1 }]),assessment.uploadIndicatorWork);
app.get("/topdfpage", assessment.pdfy);
app.get("/getpdf", assessment.getPdf);

//admins:
app.get("/adminclasses", admin.showClasses);
app.get("/getfile", admin.getFile);


http.listen(3000,function(){
  console.log("Server1 is listening on port 3000...");
});
