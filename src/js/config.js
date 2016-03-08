'use strict';

module.exports = function(app, route, blog, post) {
    // App router.
    var router = new route({
        hashbang: false,
        history: true,
        linkActiveClass: "active",
        mode: 'html5'
    });

    // Router map.
    router.map({
        '/blog': {
            name: 'blog',
            component: blog
        },
        '/post/:postId': {
            name: 'post',
            component: post
        }
    });

    // Home page redirect.
    router.redirect({
        '*': '/blog'
    })

    // Router start.
    router.start(app, '#blog');
};