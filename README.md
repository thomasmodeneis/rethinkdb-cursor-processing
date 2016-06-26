# rethinkdb-cursor-processing

![RethinkDB](https://rethinkdb.com/assets/images/docs/api_illustrations/quickstart.png)

Easily and efficiently process large sets of rethinkdb documents from a cursor without loading the entire result set in memory at once.

Really useful to avoid "FATAL ERROR - JS Allocation failed - process out of memory" when processing large datasets

## API

Install with `npm install rethinkdb-cursor-processing`. It exports a single
function that looks like this: `function rethinkdbStream(cursor, task, [concurrency], cb)`

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

var rethinkdbStream = require('rethinkdb-cursor-processing');

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
Copyright (c) 2016 Thomas Modeneis
```
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Other Modules
* I've created this module inspired by [mongo-cursor-processing](https://github.com/jergason/mongo-cursor-processing) that does the same job but for MongoDB if you are interested.