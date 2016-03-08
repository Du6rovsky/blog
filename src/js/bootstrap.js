'use strict';

module.exports = function(app, route) {
    /**
    * Modules.
    **/

    // Blog module.
    var blog = app.extend(require('../modules/blog/blog-template.js'));
    // Post module.
    var post = app.extend(require('../modules/post/post-template.js'));

    /**
    * App routing.
    *
    **/

    require('./config.js')(app, route, blog, post);
};