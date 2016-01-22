Router.configure({layoutTemplate: 'layout'});

Router.route('/', function () {
 	this.render('header');
 	this.render('sections', {to: 'sections'});
 	this.render('projects', {to: 'projects'});
});

Router.route('/bugsplat', function() {
	this.render('bugSplat');
});