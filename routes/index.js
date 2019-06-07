var express = require('express');
var router = express.Router();
var monk=require('monk');
var moment=require('moment');
var nodemailer=require('nodemailer');
var randomstring=require('randomstring');
var multer=require('multer');
// var upload = multer({ dest: 'uploads/' })
var db=monk('localhost:27017/aditya');
// console.log('connected');
var collection=db.get('signup');
var form = db.get('form');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })
/* GET home page. */
router.get('/', function(req, res)
{
	if(req.session && req.session.user){
		res.locals.user=req.session.user
		res.redirect('/home');
	}
	else{
		req.session.reset();
		res.render('index');
	}


res.render('index');
});
router.get('/forgotpassword', function(req, res)
{
res.render('forgotpassword');
});
router.get('/logout',function(req,res){
	req.session.reset();
	res.redirect('/');
})
router.post('/forgotpassword',function(req,res){
	var email = req.body.name;
	console.log(email);
	var otp=randomstring.generate(5);
	var msg="<html><head></head><body><b>"+otp+"</b></body></html>"
	collection.update({"email":email},{$set:{"password":otp}})
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'pravallikavampolu10@gmail.com',
	    pass: '7981191505'
	  }
	});

	var mailOptions = {
	  from: 'pravallikavampolu10@gmail.com',
	  to: req.body.name,
	  subject: 'successfully registered',
	  html:msg
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log("mail not send");
	  } else {
	    console.log('mail sent: ' + info.response);
	  }
	});
	
	res.redirect('/');
});

router.get('/home', function(req, res)
{
	if(req.session && req.session.user){
		res.locals.user=req.session.user
	

	form.find({},function(err,docs){
		console.log(docs);
		res.locals.data=docs;
res.render('home');



});
}
else
{
	res.redirect('/');
}
});
router.post('/edit',function(req,res){
	var id=req.body.y;
	//console.log(id);
	form.find({"_id":id},function(err,docs){
		//console.log(docs)
		res.send(docs);

	});
});
router.post('/update',function(req,res){
	var data={
		firstName:req.body.firstName,
		lastName:req.body.lastName,
		email : req.body.email,
		telephone : req.body.telephone,
	}
	form.update({"_id":req.body.id},{$set:data},function(err,docs){
		res.redirect('/home');
	});

});
//Form
router.post('/form', upload.single('image'), function(req,res){
	console.log(req.file);
	var data = {
		firstName : req.body.firstName,  
		lastName : req.body.lastName,
		email : req.body.email,
		telephone : req.body.telephone,
		img:req.file.originalname
		}
	form.insert(data, function(err,docs){
		console.log(docs);
		res.redirect('/home');
	});
});
router.post('/remove',function(req,res){
	var id=req.body.no;
	console.log(id);
	form.remove({"_id":id},function(err,docs){
		res.send(docs);
	});
});

router.post('/signup',function (req,res) {
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'youremail@gmail.com',
	    pass: 'password'
	  }
	});

	var mailOptions = {
	  from: 'youremail@gmail.com',
	  to: req.body.id,
	  subject: 'successfully registered',
	  text: 'hiii'
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log("mail not send");
	  } else {
	    console.log('mail sent: ' + info.response);
	  }
	});
	
	var data={
		name:req.body.name,
		email:req.body.id,
		password:req.body.pwd,

	}
	// console.log(req.body);
	collection.insert(data,function(err,data){
		if(err){
			console.log("error");
		}
		else{
			console.log(data);

					}
		
	res.redirect("/");
	});
});
router.post('/login',function (req,res) {
	var fname=req.body.a;
	console.log(fname);
	var password=req.body.b;
	console.log(password);
	var logintime=moment().format("hh:mm:ss a");
	console.log(logintime);
	collection.update({"name":fname},{$set:{"logintime":logintime}})
	collection.findOne({"name":fname,"password":password},function(err,docs){
		if(!docs){
			console.log("invalid");
			res.render('index',{err:"invalid username(or)password"});

		}
		else if(docs){
			delete docs.password
			req.session.user=docs;
			console.log("valid");
			res.redirect('/home');
		}
		else{
			console.log("error");
		}
	});
});


module.exports = router;
