const express = require('express')
var bodyParser = require("body-parser");
var cors = require('cors');
var mysql = require('mysql')
const app = express()
const jwt = require('jsonwebtoken');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'zankr',
  password: 'krizanic',
  database: 'tenis'
})

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
var user;
var valid=false;

function checkToken(req,res){
  var token = req.headers['token'];
  
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, "asd", function(err, decoded) {
      if (err) {
        console.log(err);
      } else {
    decoded= jwt.decode(token);
     
        user=decoded.user;
    valid=true;
      }
    });
  }
}


app.get('/igralci', function(req, res) {
  checkToken(req,res);
  
  

  if (valid) {
    // verifies secret and checks exp
   
       
     
        // if everything is good, save to request for use in other routes
      
        connection.query('SELECT igralec.ime,id_igralec FROM igralci_turnir INNER JOIN igralec on igralec.id_igralec=igralci_turnir.igralec WHERE turnir="'+req.query.id+'" ORDER BY rand()', function(err, results) {
          if (err) throw err
          var data = results;
          res.send(data);
        });
      
      }
  
});
app.get('/getmatches', function(req, res) {

checkToken(req,res);

  if (valid) {
    // verifies secret and checks exp
     console.log("turnir: "+req.query.id);
        // if everything is good, save to request for use in other routes
       
        connection.query('SELECT *,(select ime FROM igralec WHERE id_igralec=home) as home_ime,(select ime FROM igralec WHERE id_igralec=away) as away_ime FROM matchup INNER JOIN turnir on matchup.turnir=turnir.id_turnir WHERE rezultat="" and turnir="'+req.query.id+'" ', function(err, results) {
          if (err) throw err
          var data = results;
          res.send({
            data: data
          });
        });
      
   
  }
});

app.get('/ifdrawn', function(req, res) {

  var token = req.headers['token'];
checkToken(req,res);
  if (valid) {
    
    // verifies secret and checks exp

    
        // if everything is good, save to request for use in other routes
     
        connection.query('SELECT isDrawn FROM turnir WHERE id_turnir="'+req.query.id+'"', function(err, results) {
          if (err) throw err
          console.log(results);
          var data = results;
          res.send(data);
          console.log(data);
        });
      
  
  }
});
app.get('/getTours', function(req, res) {


checkToken(req,res);
console.log(user);
  if (valid) {
    // verifies secret and checks exp

    
        // if everything is good, save to request for use in other routes
     
        connection.query('SELECT * FROM turnir WHERE user="'+user+'" and isFinished!=1 ', function(err, results) {
          if (err) throw err
          var data = results;
          res.send({
            data: data
          });
       
        });
      
  
  }
});
app.get('/nextround', function (req, res) {



  checkToken(req,res);

  if (valid) {
       
        console.log("nextround"+req.query.id);
        var sql="SELECT num_rounds,max(matchup.round) as max FROM turnir INNER JOIN matchup on matchup.turnir=turnir.id_turnir WHERE id_turnir='"+req.query.id+"' and rezultat!='' ";
        connection.query(sql, function(err, result) {
          if(err) throw err
          console.log(result);
          if(result[0].num_rounds==result[0].max){
            var sql2="SELECT (CASE WHEN home = rezultat THEN away ELSE home END) as tretje_mesto,turnir FROM tenis.matchup WHERE turnir='"+req.query.id+"' and round=(select max(round)-1  FROM matchup WHERE turnir='"+req.query.id+"')  ;";
        connection.query(sql2, function(err, result) {
          if(err) throw err
          console.log(result);
          res.write(JSON.stringify({
            data: result
          }));
          res.end();
        });
      
          }else{
             var sql2="SELECT round,rezultat,turnir,floor(position/2) as position,away,home FROM matchup WHERE (advanced=0 and turnir='"+req.query.id+"') or away=null or home=null ";
        connection.query(sql2, function(err, result) {
          if(err) throw err
          
          res.write(JSON.stringify({
            data: result
          }));
          res.end();
        });
          }
        });


       
      
  


};
});


app.post('/addPlayer', function(request, response) {
  var ime=request.body[0].ime;
  var turnir=request.body[0].turnir;
  response.json();
  var sql1='INSERT INTO igralec (ime) VALUES ("' + ime + '")';
  var sql2='INSERT INTO igralci_turnir (igralec,turnir) VALUES (?,?)';
  connection.query(sql1, function(err, result) {
    if (err) throw err
    
    connection.query(sql2,[result.insertId,turnir], function(err2, result2) {
      if (err) throw err
  });
  });
  
});
app.post('/matchups', function(request, response) {
  console.log(request.body["matchups"]);
  response.json();  console.log(request.body.length);
 
  var sql1="INSERT INTO matchup (home,away,round,rezultat,turnir,position,advanced) VALUES ?";
  var sql2="UPDATE turnir set isDrawn=1,num_rounds='"+request.body['rounds']+"' WHERE id_turnir='"+request.body['matchups'][0][4]+"'";
  var sql3="UPDATE matchup set advanced=1 WHERE turnir='"+request.body["matchups"][0][4]+"' and rezultat in (SELECT * FROM(SELECT home FROM matchup where round>1 and rezultat='' )asd) or rezultat in (SELECT * FROM(SELECT away FROM matchup where round>1 and rezultat='' )asd) "
  connection.query(sql1,[request.body["matchups"]], function(err, result) {
    if(err) throw err
    connection.query(sql2, function(err, result) {
      if(err) throw err
    });
  });
  connection.query(sql3, function(err, result) {
    if(err) throw err
  });

});
app.post('/nextroundMatches', function(request, response) {
  
  response.json();  console.log(request.body.length);
 
  var sql1="INSERT INTO matchup (home,away,round,rezultat,turnir,position,advanced) VALUES ?";
  var sql3="UPDATE matchup set advanced=1 WHERE turnir='"+request.body[0][4]+"' and rezultat in (SELECT * FROM(SELECT home FROM matchup where round>1 and rezultat='' )asd) or rezultat in (SELECT * FROM(SELECT away FROM matchup where round>1 and rezultat='' )asd) "
  connection.query(sql1,[request.body], function(err, result) {
    if(err) throw err
  });
  connection.query(sql3, function(err, result) {
    if(err) throw err
  });

});
app.post('/update', function(request, response) {
  console.log(request.body.arr);
 
 for(var i=0;i<request.body.arr.length;i++){
  console.log(request.body.arr[i]);
   var sql="UPDATE matchup set rezultat= ? WHERE home=? or away=? ";
  connection.query(sql,[request.body.arr[i],request.body.arr[i],request.body.arr[i]], function(err, result) {
    if(err) throw err
   response.json();
  });
  
 }
  

});

app.post('/api/users', function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  connection.query('SELECT email FROM user WHERE email="' + email + '"', function(err, result) {
    if (err) throw err
    if (result != "") {
      console.log(result);
      response.statusMessage = "exists";
      response.status(400).end();

    } else {
      connection.query('INSERT INTO user (email,password) VALUES ("' + email + '","' + password + '")', function(err, result) {
        if (err) throw err
        response.json(result);
      });
    }
  });
});

app.post('/createTour', function(req, res) {
  console.log(req.body.user);
 
checkToken(req,res);
  if(valid){
    console.log("valid");
    var sql="INSERT INTO turnir (datum,user,kraj,isDrawn) VALUES (?,?,?,0)";
    connection.query(sql,[req.body.datum,req.body.user,req.body.kraj], function(err, result) {
      if(err) throw err
      res.json();
    });
  }
});



app.post('/auth', function(request, response) {
  console.log(request.body);
  var email = request.body.email;
  var password = request.body.password;

  var sql = "SELECT * FROM user WHERE email = ? AND password = ?";
  connection.query(sql, [email, password], function(err, results) {
    if (err) {
      //console.error(err);
      res.send(500);
    } else if (results == "") {
      response.status(200).json({
        status: "false"
      });
    } else {
      const JWTToken = jwt.sign({
          user: results[0].id_user
        },
        'asd', {
          expiresIn: 144000
        });
      response.status(200).json({
        token: JWTToken
      });
    }
  });
});



//app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))