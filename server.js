const express =require("express");
const app = express();
var mongoose= require("mongoose");
const bodyParser= require("body-parser");
var ejs = require('ejs');
app.set("views","./views");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('/register',express.static('register'));
app.use('/images',express.static('images'));
app.use('/main',express.static('main'));
app.use('/views',express.static('views'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var fs = require('fs');
var path = require('path');

mongoose.connect("mongodb+srv://JobSeekingDB:MydbJobSeeking@clusterjobseekingwebsit.hl6tp.mongodb.net/JobSeekingDatabase" ,{useNewUrlParser:true},{useUnifiedTopology:true})


var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });


var imgModel = require('./model/models');

app.get("/",function(req, res){
    res.sendFile(__dirname+"/index.html");
    
})
app.get('/views/submit_form', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('submit_form', { items: items });
		}
	});
});



app.get("/views/mogo_card",function(req, res){
    //res.render("mogo_card")
    imgModel.find({},function(err,imgModel) {
        res.render('mogo_card',{
            UserList: imgModel
        })
    })  
})

app.post('/views/submit_form', upload.single('image'), (req, res, next) => {

	var obj = {
		FullName: req.body.Fullname,
		Email: req.body.Email,
        Occupation: req.body.Occupation,
        Contact:req.body.Contact,
        Address: req.body.Address,
        Experience:req.body.Experience,
        DOB: req.body.dob,
        Education: req.body.Education,
        Description: req.body.BreafIntro,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/jpeg'
		}
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			 item.save();
          
			res.redirect('/');
		}
	});
});

app.listen(3001,function(){
	console.log("server is running on 3001");
})
