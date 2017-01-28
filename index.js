var uuid4 = require('uuid/v4')
var moment = require('moment')
var request = require('request')

function Things(accountId, startIndex) { 
  this.accountId = accountId
  this.startIndex = startIndex
}

Things.prototype.createTodo = function(todo, callback) {
  var things = this
  this.getCurrentIndex(this.startIndex, function(err, idx) {
    if (err) { return callback(err) }
    things.constructTodoItem(todo, function(err, todoItem) {
      var url = 'https://cloud.culturedcode.com/version/1/history/' + things.accountId + '/items'
      if (err) { return callback(err) }
      request.post({
        url: url,
        json: {
          'current-item-index': idx,
          'items': [ todoItem ],
          'schema': 1
        },
        headers: {
          'User-Agent': 'ThingsMac/20808500mas (x86_64; OS X 10.12.2; en_DK)',
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Encoding': 'UTF-8'
        }
      },
      function(err, httpResponse, body) {
        callback(err)
      })
    })
  })
}

Things.prototype.constructTodoItem = function(todo, callback) {
  title = todo['title'] || 'New todo'
  duedate = todo['duedate'] || null
  note = todo['note'] || null
  destination = todo['where'] || 'inbox'
  uid = uuid4().toUpperCase()
  now = Date.now() / 1000
  if (destination == 'today') {
    st = 2
  } else if (destination == 'inbox') {
    st = 0
  } else {
    return callback('Unsupported destination \'' + destination + '\'.')
  }
  if (st == 2) {
    sr = moment(moment(new Date()).format('YYYY-MM-DD')).unix()
  } else {
    sr = null
  }
  if (note != null) {
    note = '<note xml:space=\"preserve\">' + note + '</note>'
  }
  item = {}
  item[uid] = {
    "t": 0,
    "e": "Task2",
    "p": {
      "acrd": null,
      "ar": [],
      "cd": now,
      "dd": duedate,
      "dl": [],
      "do": 0,
      "icc": 0,
      "icp": false,
      "icsd": null,
      "ix": 0,
      "md": now,
      "nt": note,
      "pr": [],
      "rr": null,
      "rt": [],
      "sp": null,
      "sr": sr,
      "ss": 0,
      "st": st,
      "tg": [],
      "ti": 0,
      "tp": 0,
      "tr": false,
      "tt": title
    }
  }
  callback(null, item)
}

Things.prototype.getCurrentIndex = function(startIndex, callback) {
  url = 'https://thingscloud.appspot.com/version/1/history/'
    + this.accountId + '/items?start-index=' + startIndex
  request.get({
    url: url,
  }, 
  function(err, httpResponse, body) {
    if (err) { return callback(err) }
    var json = JSON.parse(body)
    callback(null, json['current-item-index'])
  })
}

module.exports = Things

