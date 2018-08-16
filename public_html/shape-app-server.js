var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');


//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = 8104;
var user = 'm_chillal';
var password = 'A00425207';
var database = 'm_chillal';
//#############################################


//These should not change, unless the server spec changes
var host = '127.0.0.1';
var port = '27017'; // Default MongoDB port


// Now create a connection String to be used for the mongo access
var connectionString = 'mongodb://' + user + ':' + password + '@' +
        host + ':' + port + '/' + database;


//#############################################
var shapesCollection;
const NAME_OF_COLLECTION = 'shapes';
//#############################################

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};

var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));

mongodb.connect(connectionString, function (error, db) {
    
        if (error) {
        throw error;
    }//end if


    //#############################################
    shapesCollection = db.collection(NAME_OF_COLLECTION);
    //#############################################


	process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });


    var server = app.listen(SERVER_PORT, function () {
        console.log('Listening on port %d',
                server.address().port);
    });
});




//#############################################
app.post('/saveShape', function (request, response) {

        console.log(request.body);

        shapesCollection.insert(request.body,
            function (err, result) {
                if (err) {
                    console.log(err);
                    return response.send(400, 'Error occurred syncing records');
                }//end if
                
                //else success!
                return response.send(200,'Record saved.');
            });
    });
//#############################################




//#############################################
app.post('/getAllShapes', function (request, response) {

    console.log('Retrieving all the records.');

     shapesCollection.find({}, 
        function (err, result) {//use empty to get all records
           if (err) {
               return response.send(400,'An error occurred retrieving records.');
           }//end if

                result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                                'An error occurred processing your records.');
                    }//end if

                    //if succeeded, send it back to the calling thread
                    return response.send(200, resultArray);
            });
       });

});
//#############################################


