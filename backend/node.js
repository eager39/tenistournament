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




app.get('/igralci', function(req, res) {

  var token = req.headers['token'];

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, "asd", function(err, decoded) {
      if (err) {
        console.log(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log(decoded);
        connection.query('SELECT ime FROM igralec ORDER BY rand()', function(err, results) {
          if (err) throw err
          var data = results;
          res.send({
            data: data
          });
        });
      }
    });
  }
});

app.get('/ifdrawn', function(req, res) {

  var token = req.headers['token'];

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, "asd", function(err, decoded) {
      if (err) {
        console.log(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log(decoded);
        connection.query('SELECT isDrawn FROM turnir WHERE id_turnir=1', function(err, results) {
          if (err) throw err
          var data = results;
          res.send({
            data: data
          });
          console.log(data);
        });
      }
    });
  }
});
app.get('/nextround', function (req, res) {

  var token = req.headers['token'];

  if (token) {
    var ostalo;
    var check=0;
    // verifies secret and checks exp
    jwt.verify(token, "asd", function (err, decoded) {
      if (err) {
        console.log(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log(decoded);
        connection.query("SELECT count(rezultat) as ostalo FROM matchup WHERE rezultat='' and round=(select min(round) FROM matchup WHERE turnir=1 and rezultat='' and advanced!=1) group by floor(position/2) ", function (err, results) {
          ostalo = results[0].ostalo;

          console.log("LOL" + ostalo);
          if (ostalo >= 1) {
            connection.query('SELECT round,rezultat,floor(position/2) as position FROM matchup WHERE turnir=1 and rezultat!="" and round=(select min(round) from matchup where turnir=1 and rezultat="") and advanced!=1', function (err, results) {
              if (err) console.log(err);
              console.log("haha");
              console.log(results);

              var data = results;
              if (data != "") {
                res.write(JSON.stringify({
                  data: data
                }));
                res.end();
              } else {
                check = 1;
                console.log("FUCKYOU");
              }
              console.log("CHECK" + check);
            });
          }
          if (check === 1) {
            console.log("CHECK" + check);
            console.log("else");
            connection.query('SELECT round,rezultat,floor(position/2) as position FROM matchup WHERE turnir=1 and rezultat!="" and round=(select max(round) from matchup where turnir=1 and rezultat!="") and advanced!=1 ', function (err, results) {
              if (err) console.log(err);

              console.log(err);

              var data = results;
              res.write(JSON.stringify({
                data: data
              }));
              res.end();
            });
          }
        });

      }
    });
  }
});


app.post('/test', function(request, response) {
  var ime = request.body.ime;
  response.json();
  connection.query('INSERT INTO igralec (ime) VALUES ("' + ime + '")', function(err, result) {
    if (err) throw err
  });
});
app.post('/matchups', function(request, response) {
  console.log(request.body[0]);
  response.json();  console.log(request.body.length);
 
  var sql1="INSERT INTO matchup (home,away,round,rezultat,turnir,position,advanced) VALUES ?";
  var sql2="UPDATE turnir set isDrawn=1 WHERE id_turnir=1";
  connection.query(sql1,[request.body], function(err, result) {
    if(err) throw err
    connection.query(sql2, function(err, result) {
      if(err) throw err
    });
  });

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

app.post('/api/auth', function(request, response) {
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
          email: email,
          _id: results.id_user
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