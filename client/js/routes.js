Router.configure({layoutTemplate: 'layout'});

Router.route('/', function () {
 	this.render('header');
 	this.render('sections', {to: 'sections'});
 	this.render('projects', {to: 'projects'});
 	this.render('experience', {to: 'experience'});
 	this.render('skills-and-technologies', {to: 'skills-and-technologies'});
});

Router.route('/bugsplat', function() {
	this.render('bugSplat');
});