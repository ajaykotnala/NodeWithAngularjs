(function (homeController) {
"use strict";
    var data = require("../data");

    homeController.init = function (app) {
        app.get("/", function (req, res) {
            data.getNoteCategories(function (err, results) {
                res.render("index", {
                    title: "The Board",
                    error: err,
                    categories: results,
                    CategoryErrors: req.flash("CategoryErrors")
                });
            });
        });

        app.post("/newCategory", function (req, res) {
            var categoryName = req.body.frmCategoryName;
            data.createNewCategory(categoryName, function (err) {
                if (err) {
                    console.log(err);
                    req.flash("CategoryErrors", err);
                    res.redirect("/");
                }
                else {
                    res.redirect("/notes/" + categoryName);
                }
            });
        });
    };

    // homeController.init = function (app) {
    // };
})(module.exports);