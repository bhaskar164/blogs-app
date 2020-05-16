const express = require('express'),
	  bodyParser = require('body-parser'),
	  expressSanitizer = require('express-sanitizer'),
	  mongoose = require('mongoose'),
	  methodOverride  = require('method-override'),
	  app = express();
//functionExperiment
// function prompt(str){
// 	return prompt(str);
// }
mongoose.connect("mongodb://localhost:27017/BlogsApp",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//BlogsApp Scheama
const BlogSchema = new mongoose.Schema({
		  title: String,
		  image: String,
		content: String,
		created: {type:Date,default: Date.now}
});
var blogsdb = mongoose.model("Blogs",BlogSchema);	//object of model is used to access functionalities like .create(), .find() etc....
// blogsdb.create({
// 	title:'Coding is easy peasy',
// 	image: 'https://images.pond5.com/abstract-futuristic-electronic-binary-code-footage-087828049_prevstill.jpeg',
// 	content:'The simple answer is: no, coding is not hard to learn. Why? Because if you take the time and have a little patience, you can really learn just about anything–coding is no exception. Indeed, learning to code takes time and persistence, but if you have that, then no, coding is not hard to learn...'
	
// } , function(err,blog){
// 	if(err){
// 		console.log("Error has occured!!!");
// 	}
// 	else{
// 		console.log(blog);
// 	}
// });


app.get('/',function(req,res){
	res.redirect('/blogs');
});
//IMDEX
app.get('/blogs',function(req,res){
	blogsdb.find({},function(err,blogs){
		if(err){
			console.log("Error has Occured!!");
		}
		else{
			res.render("index.ejs",{blogs:blogs})
		}
	});
});

//NEW-DIRECTING TO THE CREATE FORM FOR NEW BLOG
app.get('/blogs/new',function(req,res){
	res.render("new.ejs");
});

//CREATE- CREATING NEW BLOG INTO THE DATABASE
app.post('/blogs',function(req,res){
// 	Get all the data from the form save it to database and then redirect to home page!
	// title= req.body.title;			These lines are replaced because of using blog["title"]...such pattern in form
	// image = req.body.image;
	// content = req.body.content;
	// newBlog = {title:title,image:image,content:content};
	// console.log(req.body);
	console.log(req.body.blog.content);
	req.body.blog.content = req.sanitize(req.body.blog.content);
	console.log(req.body.blog.content);
	blogsdb.create(req.body.blog, function(err,newData){
		if(err){
			console.log("Error Occured!");
		}
		else{
			// console.log(newData);
			res.redirect('/blogs');
		}
	});
	
});


//SHOW
app.get('/blogs/:id',function(req,res){
	blogsdb.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.send("Internal error occured!");
		}
		else{
			res.render("show.ejs",{blog:foundBlog});	
		}
	});
});

//EDIT
app.get('/blogs/:id/edit',function(req,res){
	blogsdb.findById(req.params.id, function(err, blogToEdit){
		if(err){
			res.send("Internal error!");
		}
		else{
				res.render("edit.ejs",{blog:blogToEdit});
		}
	})
});

//UPDATE
app.put('/blogs/:id',function(req,res){
	blogsdb.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedData){
		if(err){
			res.send("Database Error Occured while updating");
		}
		else{
			res.redirect('/blogs');
		}
	});
});

//DELETE
app.delete('/blogs/:id',function(req,res){
		blogsdb.findByIdAndDelete(req.params.id,function(err){
			if(err){
				res.send("Internal database error while deleting....");
			}
			else{
				res.redirect('/blogs');
			}
		});
	
});

app.listen(81,function(){
	console.log("Running Blogs App at port no 81.....");
});