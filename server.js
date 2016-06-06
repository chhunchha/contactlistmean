var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    engines = require('consolidate'),
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectID,
    url = 'mongodb://localhost:27017/contactlistmean';

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render("error_template", { error: err});
}

MongoClient.connect(url,function(err, db){
    assert.equal(null, err);
    console.log('Successfully connected to MongoDB.');

    var contacts_collection = db.collection('contacts');

    // get all contacts
    app.get('/contacts', function(req, res, next) {
        console.log("Received get /contacts request");
        contacts_collection.find({}).toArray(function(err, contacts){
            if(err) throw err;

            if(contacts.length < 1) {
                console.log("No contacts found.");
            }

            console.log(contacts);
            res.json(contacts);
        });
    });

    app.post('/contacts', function(req, res, next){
        contacts_collection.insert(req.body, function(err, doc) {
            if(err) throw err;
            console.log(doc);
            res.json(doc);
        });
    });

    app.delete('/contacts/:id', function(req, res, next){
        var id = req.params.id;
        console.log("delete " + id);
        contacts_collection.deleteOne({'_id': new ObjectId(id)}, function(err, results){
            console.log(results);
            res.json(results);
        });
    });

    app.put('/contacts/:id', function(req, res, next){
        var id = req.params.id;
        contacts_collection.updateOne(
            {'_id': new ObjectId(id)},
            { $set: {
                'name' : req.body.name,
                'email': req.body.email,
                'phone': req.body.phone
                }
            }, function(err, results){
                console.log(results);
                res.json(results);
        });
    });

    app.use(errorHandler);
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    })
})
