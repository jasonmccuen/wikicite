/****************************************
* Enter a search term for Wikipedia
* submit search term and navigate to that page
* Capture the results of the citations at the bottom in the reference section
* output results in a JSON file
*
* Requires CasperJS and PhantomJS
*****************************************/

var casper = require("casper").create({
  verbose: true,
  logLevel: 'error',     // debug, info, warning, error
  pageSettings: {
  	loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
  },
    clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js"]
});

var fs = require('fs');

var url = 'https://en.wikipedia.org/wiki/Main_Page';

var searchKey = 'worm';

var title = [];
var link = [];
var output = [];

function outputJSON() {
	output.push({
		title: title,
		link: link
	});
	return JSON.stringify(output);
};

function getTitle() {
	var title = $('ol.references li a.external');
	return _.map(title, function(e) {
		return e.innerHTML; 
	}); 	
 };

 function getLink() {
 	var link = $('ol.references li a.external');
 	return _.map(link, function(e){
 		return e.getAttribute('href');
 	});
 };

casper.start(url, function() {
	this.echo(this.getTitle());
});

casper.then(function() {
	this.fill('form#searchform', {
		search: searchKey
	}, true);
});

casper.then(function() {
	console.log('Search Successful, new page is ' + this.getTitle() + ' : ' + this.getCurrentUrl());
});

casper.then(function() {
	title = this.evaluate(getTitle);
});

casper.then(function() {
	link = this.evaluate(getLink);
});

casper.run(function() {
	var data = outputJSON();
	fs.write(searchKey + '.json', data, 'w');
	this.echo("\n File Written Successfully").exit();
});
