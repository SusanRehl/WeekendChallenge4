var express=require('express');  // sets up express
var app=express();
var path=require('path');  // sets up paths
var bodyParser=require('body-parser');  // sets up body-parser for POST method
var urlencodedParser=bodyParser.urlencoded( {extended: false} );
var pg=require('pg');  // sets up postgres database
var connectionString='postgres://localhost:5432/todolist';

app.get('/', function(req, res) {  // sets up base url
  console.log('hello from base url get');
  res.sendFile(path.resolve('views/index.html')); // sends the index.html file to the browser
});

app.get('/getList', function(req, res) { // displaying to do list - uses GET
  console.log("in app.get get to do list");
  var results = [];  // array to hold tasks
  pg.connect(connectionString, function(err, client, done) {  // connecting to todolist database
    if (err) {
      console.log(err);
    } else {
      var todoList=client.query('SELECT * FROM tdlist ORDER BY taskstatus;');  // getting task and status from tdlist table
      var rows = 0;
      todoList.on('row', function(row) {  // pushing to array
        results.push(row);
      });  // end query push
      todoList.on('end', function() {  // sending to scripts
        return res.json(results);
      });
      done(); // allowing more than 5 tasks to be added
    } // end else
  }); // end database connection
}); // end /getList

app.post('/addTask',urlencodedParser, function(req, res) {  // adding task to database and DOM
  var newTask = req.body.taskname + req.body.taskstatus;
  pg.connect(connectionString, function(err, client, done) {
    client.query('INSERT INTO tdlist(taskname, taskstatus) VALUES($1, $2)', [req.body.taskname, req.body.taskstatus]); // could just send 'false' (string) instead of req.body.taskname and not have to set it in scripts
      res.send(newTask);
      done();
  }); // end database connection
 }); // end add product post function

app.post('/deleteTask', urlencodedParser, function(req, res) {  // deleting task from database and DOM
    var results =[];
    pg.connect(connectionString, function(err, client, done) {
      var resetTasks = client.query('DELETE FROM tdlist WHERE id = ' + req.body.id + ';');
      console.log( "query: " + resetTasks );
      var rows = 0;  // push each row in query into results array
      resetTasks.on( 'row', function ( row ){
        results.push( row );
        res.send(results);
        }); // end query push
      resetTasks.on( 'end', function (){  // return results array
        return res.json(results);
        });
        done();
    });
});

app.post('/statusComplete', urlencodedParser, function(req, res) { // changes status of completed tasks
    var results =[];
    pg.connect(connectionString, function(err, client, done) {
      var resetTasks = client.query('UPDATE tdlist set taskstatus=true WHERE id= ' + req.body.id + ';');
      console.log( "query: " + resetTasks );
      var rows = 0;
      resetTasks.on( 'row', function ( row ){  // push each row in query into results array
        results.push( row );
        res.send(results);
        }); // end query push
      resetTasks.on( 'end', function (){  // sends results array to DOM
        return res.json(results);
      });
        done();
    });
});

app.listen(3000, 'localhost', function(req, res) {  // spin up port
  console.log("listening on port 3000");
});

app.use(express.static('public')); // makes public folder available
