var r = require('rethinkdb');

var conn_url = process.env.RETHINKURL || "localhost";
var port = process.env.RETHINKPORT || 28015;
var authKey = process.env.RETHINKAUTHKEY || "";
var rethinkdb_table = process.env.RETHINKTABLE || "test";
var conn;

var rethinkdbStream = require('../index.js');

//auth rethinkdb
r.connect({
    host: conn_url,
    port: port,
    authKey: authKey,
    db: rethinkdb_table
}, function (err, c) {
    conn = c;
    if (err) {
        console.log(err);
        return err;
    } else {
        //get a cursor
        r.db('test').table("test")
            .run(conn)
            .then(function (cursor) {

                rethinkdbStream(cursor, worker, function(err) {
                    console.log("You finished processing this stream :D")
                });
            });
    }
});


function worker(row, cb) {
    console.log(row);

    //do something to make the world better here :D

    cb();
}