var prog = require('commander');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var cheerio = Promise.promisifyAll(require("cheerio"));
var cssB64 = require('css-b64-images-no-limit');
var colors = require('colors');
var download = require('download');
var minify = Promise.promisifyAll(require('html-minifier').minify);

var imageTypes = {
	".png": "image/png",
	".gif": "image/gif",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".bmp": "image/bmp",
	".webp": "image/webp"
}

module.exports.cli = function (inputPath, inputFile, outputPath, getOpt) {
	var $ = cheerio.load(inputFile);
	$('html').find('link').each(function () {
		if ($(this).attr('href')) {
			var RawCssPath = $(this).attr('href');
			var RawCssType = $(this).attr('type') ? $(this).attr('type') : 'undefined';
			var csspath = path.join(inputPath, RawCssPath);
			// check if not a web link
			if (RawCssPath.slice(0, 4) !== "http" && path.extname(RawCssPath) === '.css') {
				if (fs.existsSync(csspath)) {
					$(this).remove();
					console.log('css : '.red + csspath);
					cssB64.fromString(csspath, path.resolve(path.dirname(csspath)), path.resolve(path.dirname(inputPath)), function (err, css) {
						if (err) {
							console.error(err);
						} else {
							$('html').find('head').last().append('<style>' + fs.readFileSync(csspath, 'utf-8') + '</style>');
						}
					});
				} else {
					console.log('/!\\ File not found >>> '.red + csspath);
					$(this).remove();
				}
			} else if (RawCssPath.slice(0, 4) !== "http" && RawCssType.slice(0, 5) === 'image') {
				if (fs.existsSync(csspath)) {
					console.log('link icon : '.cyan + csspath);
					var imgpath = path.join(inputPath, RawCssPath);
					var img = fs.readFileSync(imgpath);
					var contentType = imageTypes[path.extname(imgpath)] || 'image/png'
					var dataUri = "data:" + contentType + ";base64," + img.toString("base64");
					$(this).attr('href', dataUri);
				} else {
					console.log('/!\\ File not found >>> '.red + csspath);
					$(this).remove();
				}
			}
		}
	});

	$('html').find('img').each(function () {
		if ($(this).attr('src')) {
			var RawImgPath = $(this).attr('src');
			var imgpath = path.join(inputPath, RawImgPath);
			if (fs.existsSync(imgpath)) {
				var img = fs.readFileSync(imgpath);
				var contentType = imageTypes[path.extname(imgpath)] || 'image/png';
				var dataUri = "data:" + contentType + ";base64," + img.toString("base64");
				$(this).attr('src', dataUri);
				console.log('img : '.yellow + imgpath);
			} else {
				console.log('/!\\ File not found >>> '.red + imgpath);
			}
		}
	});

	$('html').find('script').each(function () {
		if ($(this).attr('src')) {
			var RawJsPath = $(this).attr('src');
			var jspath = path.join(inputPath, RawJsPath);
			if (fs.existsSync(jspath)) {
				console.log('js : '.green + jspath);
				$('html').find('body').last().append('<script>' + fs.readFileSync(jspath, 'utf-8') + '</script>');
				$(this).remove();
			} else {
				console.log('/!\\ File not found >>> '.red + jspath);
				$(this).remove();
			}
		}
	});

	getOpt($.html(), outputPath);
}

module.exports.api = function (inputFilePath, outputPath, getOpt) {

	var inputPath = path.dirname(inputFilePath);
	var inputFile = fs.readFileSync(inputFilePath, 'utf-8');
	var minifyOpt = (getOpt === undefined) ? true : getOpt;

	var imageTypes = {
		".png": "image/png",
		".gif": "image/gif",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".bmp": "image/bmp",
		".webp": "image/webp"
	}

	var $ = cheerio.load(inputFile);
	$('html').find('link').each(function () {
		if ($(this).attr('href')) {
			var RawCssPath = $(this).attr('href');
			var RawCssType = $(this).attr('type') ? $(this).attr('type') : 'undefined';
			var csspath = path.join(inputPath, RawCssPath);
			// check if not a web link
			if (RawCssPath.slice(0, 4) !== "http" && path.extname(RawCssPath) === '.css') {
				if (fs.existsSync(csspath)) {
					$(this).remove();
					console.log('css : '.red + csspath);
					cssB64.fromString(csspath, path.resolve(path.dirname(csspath)), path.resolve(path.dirname(inputPath)), function (err, css) {
						if (err) {
							console.error(err);
						} else {
							$('html').find('head').last().append('<style>' + fs.readFileSync(csspath, 'utf-8') + '</style>');
						}
					});
				} else {
					console.log('/!\\ File not found >>> '.red + csspath);
					$(this).remove();
				}
			} else if (RawCssPath.slice(0, 4) !== "http" && RawCssType.slice(0, 5) === 'image') {
				if (fs.existsSync(csspath)) {
					console.log('link icon : '.cyan + csspath);
					var imgpath = path.join(inputPath, RawCssPath);
					var img = fs.readFileSync(imgpath);
					var contentType = imageTypes[path.extname(imgpath)] || 'image/png'
					var dataUri = "data:" + contentType + ";base64," + img.toString("base64");
					$(this).attr('href', dataUri);
				} else {
					console.log('/!\\ File not found >>> '.red + csspath);
					$(this).remove();
				}
			}
		}
	});

	$('html').find('img').each(function () {
		if ($(this).attr('src')) {
			var RawImgPath = $(this).attr('src');
			var imgpath = path.join(inputPath, RawImgPath);
			if (fs.existsSync(imgpath)) {
				var img = fs.readFileSync(imgpath);
				var contentType = imageTypes[path.extname(imgpath)] || 'image/png';
				var dataUri = "data:" + contentType + ";base64," + img.toString("base64");
				$(this).attr('src', dataUri);
				console.log('img : '.yellow + imgpath);
			} else {
				console.log('/!\\ File not found >>> '.red + imgpath);
			}
		}
	});

	$('html').find('script').each(function () {
		if ($(this).attr('src')) {
			var RawJsPath = $(this).attr('src');
			var jspath = path.join(inputPath, RawJsPath);
			if (fs.existsSync(jspath)) {
				console.log('js : '.green + jspath);
				$('html').find('body').last().append('<script>' + fs.readFileSync(jspath, 'utf-8') + '</script>');
				$(this).remove();
			} else {
				console.log('/!\\ File not found >>> '.red + jspath);
				$(this).remove();
			}
		}
	});

	getOpt($.html(), outputPath, minifyOpt);

}

module.exports.getOpt = function (resHtml, outputPath, minifyOpt) {
	if (minifyOpt) {
		console.log('');
		console.log('minify all. Process may take a few minutes with large file.');
		console.log('');
		minifyFile(resHtml, outputPath);
	} else {
		console.log('');
		console.log('Output file name : ' + outputPath);
		console.log('');
		writeFile(resHtml, outputPath);
	}
}

module.exports.minifyFile = function (resHtml, outputPath) {
	//var escapeChar = (commandLine.escape === undefined) ? '' : commandLine.escape;

	var opt = {
		removeAttributeQuotes: false,
		minifyCSS: true,
		minifyJS: true,
		collapseWhitespace: true,
		removeComments: true
			//ignoreCustomFragments: eval(escapeChar)
	};
	
	var resHtml = minify(resHtml, opt, function (err) {
		if (err) {
			console.error('error will processing file.');
		}
	});

	console.log('');
	console.log('Output file name : ' + outputPath);
	console.log('');
	writeFile(resHtml, outputPath);
}

module.exports.writeFile = function (resHtml, outputPath) {
	fs.writeFile(outputPath, resHtml, function (err) {
		if (err) {
			console.log('');
			console.log('File error: ' + err + '. Exit.');
		} else {
			console.log('');
			console.log('All done. Exit.'.green);
		}
	});
}
