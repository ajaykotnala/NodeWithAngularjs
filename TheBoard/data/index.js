(function (data) {
"use strict";
    var seedData = require("./seedData");
    var database = require("./database");

    data.getNoteCategories = function (next) {
        // next(null, seedData.initialNotes);  //from hard coded json
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.find().toArray(function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });

            }
        });
    };

    data.createNewCategory = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.find({ name: categoryName }).count(function (err, count) {
                    if (err) {
                        next(err);
                    } else {
                        if (count !== 0) {
                            next("category allready exists");
                        } else {
                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                            db.notes.insert(cat, function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    function seedDatabase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log(`error happen while retriving data from database: ${err}`);
            } else {
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log(`error happen while retriving count: ${err}`);
                    } else {
                        if (count === 0) {
                            console.log(`seeding of data into database started...`);
                            seedData.initialNotes.forEach(function (item) {
                                db.notes.insert(item, function (err) {
                                    if (err) {
                                        console.log(`error happen inserting data into database: ${err}`);
                                    }
                                });
                            });
                        } else {
                            console.log(`database allready seeded...`);
                        }
                    }
                });
            }
        });
    }

    seedDatabase();

})(module.exports);