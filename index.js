var express = require('express'),
    http = require('http'),
    redis = require('redis'),
    elasticsearch = require('./esService');
    

var app = express();


var client = redis.createClient(
  process.env.REDIS_1_PORT_6379_TCP_PORT || 6379,
  process.env.REDIS_1_PORT_6379_TCP_ADDR || '127.0.0.1'
);

app.get('/suggest/:input', function(req, res, next) {
  elasticsearch.getSuggestions(req.params.input).then(function (result) { res.json(result) });  
});
app.get('/regenerateIndex', function(req, res, next) {
  elasticsearch.indexExists().then(function (exists) {  
    if (exists) {
      return elasticsearch.deleteIndex();
    }
  }).then(function () {
    return elasticsearch.initIndex().then(elasticsearch.initMapping).then(function () {
      //Add a few titles for the autocomplete
      //elasticsearch offers a bulk functionality as well, but this is for a different time
      var promises = [
        'Thing Explainer',
        'The Internet Is a Playground',
        'The Pragmatic Programmer',
        'The Hitchhikers Guide to the Galaxy',
        'Trial of the Clone'
      ].map(function (bookTitle) {
        return elasticsearch.addDocument({
          title: bookTitle,
          content: bookTitle + " content",
          metadata: {
            titleLength: bookTitle.length
          }
        });
      });
      return Promise.all(promises);
    });
  });
});

app.get('/addDocument/', function(req, res, next) {
    elasticsearch.addDocument(req.body).then(function (result) { res.json(result) });
});

app.get('/', function(req, res, next) {
    res.send('hello');
});

app.get('/', function(req, res, next) {
    res.send('hello');
});


app.get('/', function(req, res, next) {
    res.send('hello');
});


http.createServer(app).listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + (process.env.PORT || 3000));
});