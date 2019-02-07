var path = require("path");

module.exports = function(app){

    app.get('/', function(res, rep){
        res.json(path.join(__dirname, "../public/home.html"));
    });

    app.get('/survey', function(res, rep){
        res.json(path.join(__dirname, "../public/survey.html"));
    });  
}