(function (database) {
"use strict";
    var mongodb = require("mongodb");
    var mongoUrl = "mongodb://localhost:27017/theBoard";
    var thedb = null;

    database.getDb = function (next) {
        if (!thedb) {
            mongodb.MongoClient.connect(mongoUrl, function(err,db){
                if(err){
                    next(err,null);
                }else{
                    thedb = {
                        db:db,  //its object which contain database  = compile time value is theBoard
                        notes:db.collection("notes")  //compile time value is notes (table in terms of sql)
                    };
                    next(null, thedb);
                }
            });
        } else {
            next(null, thedb);
        }
    };
})(module.exports);