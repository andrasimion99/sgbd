const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const mypw = "STUDENT";
const express = require('express');
const app = express();
app.use(express.static('public'));

async function run() {
  let connection;
  try {
    app.listen(1234, () => {
      console.log('listening on 1234');
    });

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    app.get('/order', (req, res) => {
      var camp = req.query.camp;
      var ord = req.query.ord;

      oracledb.getConnection({
        user: "student",
        password: mypw,
        connectString: "localhost:1521"
      }, function (err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.execute(
            `SELECT nume, prenume, an FROM studenti order by ` + camp + " " + ord, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                var obj = "<p>Lista extrasa cu " + result.rows.length + " elemente<p>";
                for (var i = 0; i < result.rows.length; i++) {
                  obj += "<p>" + JSON.stringify(result.rows[i]) + "</p>"
                }
                res.send(obj)
              }
            });
        }
      });
    });

    app.get('/filter', (req, res) => {
      var an = req.query.an;
      var camp = req.query.camp;
      oracledb.getConnection({
        user: "student",
        password: mypw,
        connectString: "localhost:1521"
      }, function (err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.execute(
            `SELECT nume, prenume, an FROM studenti where ` + camp + ` = :an`, { an: { val: an } }, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                var obj = "<p>Lista extrasa cu " + result.rows.length + " elemente<p>";
                for (var i = 0; i < result.rows.length; i++) {
                  obj += "<p>" + JSON.stringify(result.rows[i]) + "</p>"
                }
                res.send(obj)
              }
            });
        }
      });
    });

    app.get('/name', (req, res) => {
      var nume = req.query.nume;
      var prenume = req.query.prenume;
      oracledb.getConnection({
        user: "student",
        password: mypw,
        connectString: "localhost:1521"
      }, function (err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.execute(
            `SELECT * FROM studenti where nume = :nume and prenume = :prenume`, { nume: { val: nume }, prenume: { val: prenume } }, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                var obj;
                if (result.rows.length == 0) {
                  obj = "Nu exista nici un student cu numele si prenumele introduse";
                  res.send(obj)
                } else {
                  obj = "Am gasit studentul";
                  for (i = 0; i < Object.keys(result.rows[0]).length; i++) {
                    obj += "<p>" + Object.keys(result.rows[0])[i] + " : " + result.rows[0][Object.keys(result.rows[0])[i]] + "</p>"
                  }
                  res.send(obj)
                }
              }
            });
        }
      });
    });
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
run();