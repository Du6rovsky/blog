var Vue   	  = require('vue'), 		// Initiates vue package.
	VueRouter = require('vue-router');	// Initiates vue route package.

// vue-router usage init.
Vue.use(VueRouter);

// Localstorage usage init.
var storage = require('./js/localstorage.js');

// Create blog app module.
var blogApp = Vue.extend({
	el: function() {
    	return '#blog'
    },
	data: function() {
    	return {
			posts : storage.fetchArray("posts"),
			newPost : '',
			newComment: '',
			edit : false,
			filter : ''
		}
	},
	ready: function() {
		this.$watch("posts", function(value){
			storage.saveArray("posts", value);
		}, {deep: true});
	},
	methods : {
		addPost: function(e) {
			e.preventDefault();

			// Generate uniq ID.
			function guid() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
				}
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					s4() + '-' + s4() + s4() + s4();
			}

			// Push new post to posts model.
			if(this.newPost != '') {
				var parse = this.newPost.split("#");
				var post = {
					theme: '',
					content: '',
					id: guid(),
					comments: []
				};

				if (parse.length == 1) {
					// No theme post.
					post.content =  parse;
				} else {
					// Post with theme.
					for (var i = 0; i < parse.length; i ++) {
						if (i == 0 && parse[i] != '') {
							// Push theme.
							post.theme = parse[i];
						} else if (i == 1 && parse[i] != ''){
							// Push post.
							post.content = parse[i];
						} else if (parse[i] != ''){
							if (parse[i - 1] != '') {
								// Push post with hashbang delimetr.
								post.content = post.content + '#' + parse[i];
							} else {
								// Push post without hashbang delimetr.
								post.content = post.content + parse[i];
							}
						}
					};
				};

				this.posts.push(post);

				// Reset newPost.
				this.newPost = '';
			}
		},
		removePost : function(id) {
			for (var i = 0; i < this.posts.length; i ++) {
				if (this.posts[i].id == id) {
					this.posts.splice(i, 1);
				}
			}
		},
		addComment : function(e, index) {
			e.preventDefault();

			for (var i = 0; i < this.posts.length; i ++) {
				if (this.posts[i].id == index) {
					this.posts[i].comments.push(this.newComment);

					// Reset newPost.
					this.newComment = '';
				}
			};
		},
		removeComment: function(iPost, iComment){
			for (var i = 0; i < this.posts.length; i ++) {
				if (this.posts[i].id == iPost) {
					this.posts[i].comments.splice(iComment, 1);
				}
			}
		}
	}
});

require('./js/bootstrap.js')(blogApp, VueRouter);