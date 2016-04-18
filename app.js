//Script to start the server and request data from USDA api for Nutri Details
//@Author: Phani
//version : Init 1.0 (base)
var express = require('express');
var request = require('request');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// api definitions
var api_key = ''  //API KEY , Need to be manually Added
var usdn_seach_api ='http://api.nal.usda.gov/ndb/search/?format=json&'  //To search for food details and get ndbno
var usdn_ndbno_api = 'http://api.nal.usda.gov/ndb/reports/?ndbno=' // To get nutri details from ndbno
// user variables
var food_name= ''
var ndbno_val=''
var nutri_url= ''
var nutri_values =''
var nutri_name = []
var nutri_unit = []
var nutri_value = []
var craig //final response to be sent
//var routes = require('./routes');
//var users = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

//app.get('/', routes.index);
//app.get('/users', users.list);
app.get('/', function(req, res) {res.render('index')});

//route for searching
app.get('/searching', function(req, res){
 //res.send("WHEEE");
 var food_val = req.query.search;
 //console.log(food_val)
 
 //form URL for food search
 var food_url = usdn_seach_api+'q='+food_val+'&sort=n&max=25&offset=0&api_key='+api_key
 console.log(food_url)
 // request module is used to process the usdn url and return the results in JSON format
 request(food_url, function(err, resp, body) {
 body = JSON.parse(body);
 // logic used to compare search results with the input from user
  try{
	  food_name = body.list.item[0]['name'];
	  ndbno_val = body.list.item[0]['ndbno'];
	  //console.log
	  nutri_url = usdn_ndbno_api+ndbno_val+'&type=b&format=json&api_key='+api_key
	  console.log('GET /',nutri_url)
	  request(nutri_url,function(err,resp,body) {
		body = JSON.parse(body);
		try{
			console.log('it coming in first try');
			//nutri_values = body.report.food.nutrients[0]['name']
			nutri_values = body
			console.log('no of items:',nutri_values.report.food.nutrients.length)
			var loop_cnt = nutri_values.report.food.nutrients.length		
			// Just to ensure type is Array/Object
			console.log(typeof(nutri_name),typeof(nutri_unit),typeof(nutri_value));
			// Store the values to arrays reinit to Blank Arrays
			nutri_name = [];
			nutri_unit = [];
			nutri_value = [];
			console.log('Its here');
			for (var i = 0;i < loop_cnt;i++){
				nutri_name.push(body.report.food.nutrients[i]['name'])
				nutri_unit.push(body.report.food.nutrients[i]['unit'])
				nutri_value.push(body.report.food.nutrients[i]['value'])
			}
			//console.log(nutri_name,nutri_unit,nutri_value);
			console.log('reinit')
			nutri_values = ''
			craig = nutri_name[1]+String(nutri_value[1])+nutri_unit[1]
			console.log(craig);
		}
		catch(err){
			console.log(err)
		}
		
	  });
  }
  catch(err)
  {
	  craig = body.errors.error[0].message;
  }
  
 // pass back the results to client side
 res.send(craig);
 res.end()
 });
});


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
