// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
	var express  = require('express');
	var app      = express(); 								// create our app w/ express
	var mongoose = require('mongoose'); 					// mongoose for mongodb
	var morgan = require('morgan'); 			// log requests to the console (express4)
	var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
	var methodOverride = require('method-override');
	var Event = require('./models/event');


mongoose.connect('mongodb://assessment:assessmentEvents2014@ds037977.mongolab.com:37977/events');
// connect to our  database

var MongoClient = require('mongodb').MongoClient;

// DATABASE connection
MongoClient.connect('mongodb://assessment:assessmentEvents2014@ds037977.mongolab.com:37977/events', function(err, db) {
    if(err) throw err;
    
    console.log("Connected Successfully");
    
    db.collection('events', function(err, events) {
        if(err) throw err;
        
        console.log('Pointer to the collection is received.');
        
        
        // configure app to use bodyParser()
        // this will let me get the data from a
        
        app.use(morgan('dev')); 										// log every request to the console
	    app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
	    app.use(bodyParser.json()); 									// parse application/json
	    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
	    app.use(methodOverride());
        
        var port = process.env.PORT || 7000; // set port
        
        // ROUTES FOR OUR API
        // =============================================================================
        //var router = express.Router(); // get an instance of the express Router
        
        function checkNull(input){
            if(typeof input=='undefined'){
                return "";
            }else{
                return input;
                }
        }
             
        app.all("/events/*", function(req, res, next) {
		  res.header("Access-Control-Allow-Origin", "*");
		  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
		  return next();
		});
		app.all("/events/*", function(req, res, next) {
		  if (req.method.toLowerCase() !== "options") {
			return next();
		  }
		  return res.send(204);
		});
        // ..............................POST      
        // create an event
        app.post('/events',function(req, res) {
            var the_Event=new Event();
            the_Event.title = checkNull(req.body.title);
            the_Event.from=checkNull(req.body.from);
            the_Event.to=checkNull(req.body.to);
            the_Event.location=checkNull(req.body.location);
            the_Event.description=checkNull(req.body.description);
            the_Event.participants=checkNull(req.body.participants).trim().split(' ');
            the_Event.owner=checkNull(req.body.owner);
            
            
            
            the_Event.save(function(err) {
			if (err)
				res.send(err);
        
        res.json({ message: 'Event created!' });
        console.log('Event created!');
    });

            
        });
        
        // ..............................GET ALL my events
        //router.route('/events')
        // get all the events I created
        app.get('/events',function(req, res) {
            events.find({ owner: {$regex: new RegExp('\\b'+''+'\\b','i')} }).toArray(function(err, results){
                if(err) throw err;
                
                res.json(results);
                console.log(results);
            });
        });
        
    // ..............................GET ALL events with keyword
    //router.route('/events/search/:keyword')
    // get all the event with keyword
    
    app.get('/events/search/:keyword',function(req, res) {
        
        events.find({ title: {$regex: new RegExp('\\b'+req.params.keyword+'\\b','i')} ,owner: {$regex: new RegExp('\\b'+'Oluwatoni'+'\\b','i')} }).toArray(function(err, results) {
            if (err){
                res.send(err);
            }
            
            res.json(results);
            console.log(results);
        });
    });
    
    // ..............................GET an event by event_id
    
    // get the event with id
    app.get('/events/:event_id',function(req, res) {
        Event.findById(req.params.event_id, function(err, results) {
            if (err){
                res.send(err);
            }
            res.json(results);
            console.log(results);
            
        });
    });
    
    // ..............................UPDATE different event details
    
    // update the event with id
    app.put('/events/:event_id',function(req, res) {
        Event.findById(req.params.event_id, function(err, the_event) {
        
        var ntitle = req.body.title;
        var nfrom=req.body.from;
        var nto=req.body.to;
        var nlocation=req.body.location;
        var ndescription=req.body.description;
        var nparticipants=req.body.participants;
        var nowner=req.body.owner;
        
        
        if(typeof ntitle=='string'){
        the_event.title=ntitle;
        }
        
        if(typeof nfrom=='string'){
        the_event.from=nfrom;
  
        }
        if(typeof nto=='string'){
        the_event.to=nto;
                 }
        if(typeof ndescription=='string'){
        the_event.description=ndescription;
        }
        
        if( typeof nlocation=='string'){
        the_event.location=nlocation;
        }
        if( typeof nparticipants=='string'){
        the_event.participants=nparticipants.trim().split(' ');
        }
        if(typeof nowner=='string'){
        the_event.owner=nowner;
        }
        the_event.save(function(err) {
			if (err)
				res.send(err);
        
        res.json({ message: 'Event updated!' });
        console.log('Event updated!');
    });
    });
    });
    
    
    // ..............................DELETE an event
   
     app.delete('/events/:event_id',function(req, res) {
        Event.remove({_id: req.params.event_id }, function(err, results) {
            if (err){
                res.send(err);
            }
            
            res.json({ message: 'Successfully deleted' });
            console.log('Successfully deleted');
        });
    });
    
    // test route to make sure everything is working
 // app.get('/', function(req, res) {
//          res.json({ message: 'Welcome to my RESTful API implementation that interacts with a mongodb database' });
//          console.log('Welcome to my RESTful API implementation that interacts with a mongodb database'); 
//      });
    
     app.get('*', function(req, res) {
		res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
    // START THE SERVER
    // =============================================================================
    app.listen(port);
    console.log('Magic happens on port ' + port);
});
});
