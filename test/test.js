var assert = require('assert')
var rethinkdbStream = require('../index.js');

describe('CursorStream', function() {
  describe('when given a worker function, a cursor and a callback', function() {
    it('execute worker function for each cursor next row', function(done) {
      var timesCalled = 0;
      function worker(row, cb) {
        process.nextTick(function() {
          timesCalled++;
          cb();
        })
      }

      var timesNextObjectCalled = 0;
      var mockCursor = {
        next: function(cb) {
          if (timesNextObjectCalled < 10) {
            cb(null, timesNextObjectCalled++)
          }
          else {
            cb();
          }
        }
      };

      rethinkdbStream(mockCursor, worker, function(err) {
        assert.ifError(err);
        assert.equal(timesCalled, 10);
        done()
      })
    });

    it('It should finish & callback if any errors are thrown from the cursor', function(done) {
      function worker(row, cb) {
        process.nextTick(cb)
      }


      var timesNextObjectCalled = 0;
      var mockCursor = {
        next: function(cb) {
          if (timesNextObjectCalled < 10) {
            cb(null, timesNextObjectCalled++)
          }
          else {
            cb(new Error('Cursor returned error'))
          }
        }
      };

      rethinkdbStream(mockCursor, worker, function(err) {
        assert(err);
        done()
      })
    })
  })
});
