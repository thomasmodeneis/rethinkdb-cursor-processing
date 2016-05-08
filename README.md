# rethinkdb-cursor-processing

![RethinkDB](https://rethinkdb.com/assets/images/docs/api_illustrations/quickstart.png)

Easily and efficiently process large sets of rethinkdb documents from a cursor without loading the entire result set in memory at once.

Really useful to avoid "FATAL ERROR - JS Allocation failed - process out of memory" when processin large datasets

## API

Install with `npm install rethinkdb-cursor-processing`. It exports a single
function that looks like this:

### `function rethinkdbStream(cursor, task, [concurrency], cb)

* `cursor` Object - a Rethinkdb cursor, as returned from a rethinkdb query.
* `task` Function - `function(item, done)` - a worker function that will be
   called once with each item that comes off the cursor. Call the `done`
   function when you are done with the item.
* `concurrency` Number - number of worker functions to be running at the same time.
   Defaults to 10 if unspecified.
* `cb` Function - `function(err)` that will be called when all items from the
   cursor have been processed, or any of them were processed with an error.

## Simple Example

```js
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
```


## Gulp will run mocha tests for the project 

```js
[10:08:05] Starting 'default'...
 2   -_-_,------,
 0   -_-_|   /\_/\ 
 0   -_-^|__( ^ .^) 
     -_-  ""  "" 

  2 passing (16ms)

[10:08:05] Finished 'default' after 64 ms
```


## License 
The MIT License (MIT)


## Credits
* I've created this module inspired by [mongo-cursor-processing](https://github.com/jergason/mongo-cursor-processing) that does the same job but for MongoDB if you are interested.