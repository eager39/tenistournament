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

function checkTokenWithPromise(req){
  return new Promise((resolve, reject) => {
    var token = req.headers['token'];
    if (token) {
      jwt.verify(token, "asd", function(err, decoded) {
        if (err) {
          reject(err);
        } else {
          decoded= jwt.decode(token); 
          resolve(decoded.user);
        }
      });
    }
  });
}
/*
function checkTokenWithCallback(req, callback) {
  var token = req.headers['token'];
  if (token) {
    jwt.verify(token, "asd", function(err, decoded) {
      if (err) {
        callback(err);
      } else {
        decoded= jwt.decode(token); 
        callback(null, decoded.user);
      }
    });
  }
}
*/


app.get('/igralci', function(req, res) {
  checkTokenWithPromise(req).then(user => {

    connection.query('SELECT igralec.ime,id_igralec FROM igralci_turnir INNER JOIN igralec on igralec.id_igralec=igralci_turnir.igralec WHERE turnir="'+req.query.id+'" ORDER BY rand()', function(err, results) {
      if (err) throw err
      var data = results;
      res.send(data);
    });
  }, err => {
    console.log("No such user. Error: " + err);
  });
});


app.get('/getmatches', function(req, res) {
  checkTokenWithPromise(req).then(user => {
      connection.query('SELECT *,(select ime FROM igralec WHERE id_igralec=home) as home_ime,(select ime FROM igralec WHERE id_igralec=away) as away_ime FROM matchup INNER JOIN turnir on matchup.turnir=turnir.id_turnir WHERE rezultat="" and turnir="'+req.query.id+'" ', function(err, results) {
        if (err) throw err
        var data = results;
        res.send(data);
      });
    }, err => {
      console.log("No such user. Error: " + err);
    });
  
});

app.get('/ifdrawn', function(req, res) {

  checkTokenWithPromise(req).then(user => {

        connection.query('SELECT isDrawn FROM turnir WHERE id_turnir="'+req.query.id+'"', function(err, results) {
          if (err) throw err

          var data = results;
          res.send(data);
        
        });
      
      }, err => {
        console.log("No such user. Error: " + err);
      });
  
});
app.get('/getTours', function(req, res) {

  checkTokenWithPromise(req).then(user => {
     var sql='SELECT * FROM turnir WHERE user=? and isFinished!=1 ';
        connection.query(sql,[user], function(err, results) {
          if (err) throw err
          var data = results;
          res.send(data);
        });
      }, err => {
        console.log("No such user. Error: " + err);
      });
});

app.get('/nextround', function (req, res) {

  checkTokenWithPromise(req).then(user => {
    var id = req.query.id;
    var sql = "SELECT num_rounds,max(matchup.round) as max FROM turnir INNER JOIN matchup on matchup.turnir=turnir.id_turnir WHERE id_turnir=? and rezultat!='' ";
    connection.query(sql, [id], function (err, result) {
      if (err) throw err
      console.log(result);
      if (result[0].num_rounds == result[0].max) {
        var sql2 = "SELECT (CASE WHEN home = rezultat THEN away ELSE home END) as tretje_mesto,turnir FROM tenis.matchup WHERE turnir=? and round=(select max(round)-1  FROM matchup WHERE turnir=?)  ;";
        connection.query(sql2, [id, id], function (err, result) {
          if (err) throw err
          console.log(result);
          res.write(JSON.stringify(result));
          res.end();
        });
      } else {
        var sql2 = "SELECT round,rezultat,turnir,floor(position/2) as position,'false' as tretje,away,home FROM matchup WHERE (advanced=0 and turnir=?) or away=null or home=null ";
        connection.query(sql2, [id], function (err, result) {
          if (err) throw err
       
        
          console.log(result);
          res.write(JSON.stringify(result));
          res.end();
        });
      }
    });

  }, err => {
    console.log("No such user. Error: " + err);
  });

});
app.get("/getAllMatches",function(req,res){
checkTokenWithPromise(req).then(user => {

  var sql="SELECT id_matchup,round,rezultat,home as home_id,away as away_id,turnir,num_rounds,CASE WHEN A.ime IS NULL THEN 'bye' ELSE A.ime END AS away,CASE WHEN H.ime IS NULL THEN 'bye' ELSE H.ime END AS home,R.ime as rezultat_ime  FROM tenis.matchup INNER JOIN turnir on turnir.id_turnir=matchup.turnir LEFT JOIN igralec H on H.id_igralec=matchup.home LEFT JOIN igralec A on A.id_igralec=matchup.away INNER JOIN igralec R on R.id_igralec=matchup.rezultat  WHERE turnir=?" ;
  connection.query(sql,[req.query.id], function(err, result) {
    if(err) throw err
    res.send(result);
  });

}, err => {
  console.log("No such user. Error: " + err);
});

});


app.post('/addPlayer', function(request, response) {

  checkTokenWithPromise(request).then(user => {
    var ime = request.body[0].ime;
    var turnir = request.body[0].turnir;

    var sql1 = 'INSERT INTO igralec (ime) VALUES (?)';
    //var sql2 = 'INSERT INTO igralci_turnir (igralec,turnir) VALUES (?,?)';

    var insertPlayer = new Promise(function (resolve, reject) {
      connection.query(sql1, [ime], function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

   /* insertPlayer.then(result => {
      connection.query(sql2, [result.insertId, turnir], function (err2, result2) {
        if (err2) throw err2
        response.status = 200;
        response.send(result2);
      });


    }, err => {
      console.log("query failed" + err);
      response.status = 404;
    });*/

  }, err => {
    console.log("No such user. Error: " + err);
    response.status = 401;
  });
  
});

app.post('/matchups', function (request, response) {

  var id = request.body["matchups"][0][4];
  var num_rounds = request.body['rounds'];
  var sql1 = "INSERT INTO matchup (home,away,round,rezultat,turnir,position,advanced) VALUES ?";
  var sql2 = "UPDATE turnir set isDrawn=1,num_rounds=? WHERE id_turnir=?";
  var insertMatchups = new Promise(function (resolve, reject) {
    connection.query(sql1, [request.body["matchups"]], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  var updateTurnir = new Promise(function (resolve, reject) {
    connection.query(sql2, [num_rounds, id], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  insertMatchups.then(result => {
    updateTurnir.then(values => {
      response.json();
      console.log(values);
      console.log(result);
    });
  }, err => {
    console.log("query failed" + err);
    response.status = 404;
  });
});

app.post('/nextroundMatches', function(request, response) {
  console.log(request.body);
  var id = request.body[0][4];
 
 
  var sql1="INSERT INTO matchup (home,away,round,rezultat,turnir,position,advanced) VALUES ?";
  var sql3="UPDATE matchup set advanced=1 WHERE turnir=? and rezultat in (SELECT * FROM(SELECT home FROM matchup where round>1 and rezultat='' and turnir=? )asd) or rezultat in (SELECT * FROM(SELECT away FROM matchup where round>1 and rezultat='' and turnir=? )asd) ";
  
  var insertNextRound = new Promise(function (resolve, reject) {
     connection.query(sql1,[request.body], function(err, result) {
    if(err){
      reject(err);
    }else{
      console.log(result);
      resolve(result);
    }
  });
    });
  
 insertNextRound.then(result=>{
 connection.query(sql3,[id,id,id], function(err, result) {
    if(err){
      response.status=400;
      console.log("error");
      console.log(err);
    }else{
      console.log("success");
      console.log(result);
      response.send(result);
    }
  });
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
  checkTokenWithPromise(req).then(user => {
   
    var sql="INSERT INTO turnir (datum,user,kraj,isDrawn) VALUES (?,?,?,0)";
    connection.query(sql,[req.body.datum,req.body.user,req.body.kraj], function(err, result) {
      if(err) throw err
      res.json();
    });
  },err=>{
    console.log("insert failed"+err);
  });
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