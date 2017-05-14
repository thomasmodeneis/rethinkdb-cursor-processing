var r = require('rethinkdb');

var RETHINKDB_HOST = process.env.RETHINKDB_HOST || "localhost";
var RETHINKDB_PORT = process.env.RETHINKDB_PORT || 28015;
var RETHINKDB_KEY = process.env.RETHINKDB_KEY || "";
var RETHINKDB_TABLE = process.env.RETHINKDB_TABLE || "test";
var conn;
var DEBUG_MODE_ON = process.env.DEBUG || false;


// if you will use this outside this project, remember you will need to call the lib by the name:
// var rethinkdbStream = require('rethinkdb-cursor-processing');

var rethinkdbStream = require('../index.js');

//auth rethinkdb
r.connect({
    host: RETHINKDB_HOST,
    port: RETHINKDB_PORT,
    authKey: RETHINKDB_KEY,
    db: RETHINKDB_TABLE
}, function (err, c) {
    conn = c;
    if (err) {
        console.log(err);
        return err;
    } else {
        //get a cursor
        r.db('test').table("test")
        //select all registers that do not have updatedAt
            .filter(r.row.hasFields('updatedAt').not())
            .run(conn)
            .then(function (cursor) {

                rethinkdbStream(cursor, worker, 1, function () {
                    console.log("You finished processing this stream :D")
                });
            });
    }
});


function worker(row, cb) {

    //do something to make the world better here :D
    row.updatedAt = new Date();

    updateData(row, function (err, total) {

        if (err) {
            //log err
            console.log("Got error when updating row -> ", row.id, err)
        } else {
            //log ok
            console.log("Total updated -> ", total)
        }

        //continue processing next row
        cb();

    });
}

function updateData(rowToUpdate, cb) {
    r.db('test').table('test').insert(rowToUpdate, {
        returnChanges: false,
        conflict: "update"
    }).run(conn, function (err, result) {
        if (err) {
            cb(err, 0);
        } else {
            if (DEBUG_MODE_ON) {
                console.log("{i:", result.inserted, "},{r:", result.replaced + "}");
            }
            cb(null, result.inserted + result.replaced);
        }
    });
}
