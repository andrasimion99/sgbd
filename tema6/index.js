const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const mypw = "STUDENT";
const user = "student";

oracledb.getConnection(
  {
    user: user,
    password: mypw,
    connectString: "localhost:1521"
  },
  function(err, connection) {
    if (err) {
      console.log(err);
      process.exit(-1);
    }
    // DESERIALIZAREA OBIECTULUI
    connection.execute(`SELECT obiect FROM filme_oop WHERE id = 1`, function(
      err,
      result
    ) {
      if (err) {
        console.log(err);
      } else {
        // console.log(JSON.stringify(result.rows[0]));
        console.log("obiectul meu local deserializat");
        const local_obj = JSON.stringify(result.rows[0]);
        console.log(JSON.parse(local_obj));
      }
    });
    // SERIALIZAREA OBIECTULUI obj_movie
    const obj_movie = {
      NUME: "Locke and key",
      GENRE: "Thriller",
      DURATA: 500,
      NOTA: 10,
      NUMARNOTE: 1
    };
    connection.execute(
      `INSERT INTO filme_oop VALUES (:id, :obj)`,
      {
        id: 5,
        obj: {
          type: "MOVIE",
          val: obj_movie
        }
      },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          connection.execute(
            `SELECT obiect FROM filme_oop WHERE id = 5`,
            function(err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("acesta este obiectul serializat:");
                console.log(result.rows[0]);
              }
            }
          );
        }
      }
    );
  }
);
