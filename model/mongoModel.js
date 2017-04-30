var mongoose= require("mongoose");

//mongoDB connection:
mongoose.connect("mongodb://localhost/gpusers");

//The schema:
var usersSchema= mongoose.Schema({
      _id:String,
      cwid: String,
      username: String,
      password: String,
      role: String
});

//The model:
var users= mongoose.model("users",usersSchema);

module.exports= users;

//for reference:
//gpusers is the database name.
//users is the collection(table) name.
