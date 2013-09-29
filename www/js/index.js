var fs;
var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);

		if(!fs)
			console.log('fs in uninitialized - that\'s good!');
		else
			console.log('shit: can\'t check if fs is initialized');

		// Request filesystem
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFileSystemSuccess, app.onFileSystemError);
	},

	onFileSystemSuccess: function(fileSystem) {
		console.log('File system name: ' + fileSystem.name);
		console.log('File system root name: ' + fileSystem.root.name);
		fs = fileSystem;

		app.prepareTiles();
	},

	onFileSystemError: function(event) {
		console.log('Failed to initialze file system');
	},

	prepareTiles: function() {
		if(fs)
		{
			var tiles = fs.root.getFile('SpatialiteTest.sqlite', { create: false }, function() {
				console.log('file exists');
				app.loadTiles();
			}, function() {
				console.log('file does not exist');
				console.log('downloading file');

				var ft = new FileTransfer();

				ft.download('http://localhost/~martin/SpatialiteTest.mbtiles', fs.root.fullPath + '/SpatialiteTest.sqlite', function(entry) {
					console.log('download complete: ' + entry.fullPath);
					app.loadTiles();
				}, function(error) {
					console.log('download error: ' + error);
				});
			});
		}
	},
	//*
	loadTiles: function() {
		console.log('Executing loadTiles');
		var db = window.sqlitePlugin.openDatabase({ name: "SpatialiteTest.sqlite", bgType: 1 });
		var map = L.map('map', {
			center: new L.LatLng(49.5964, 11.0077),
			zoom: 15,
			minZoom: 15,
			maxZoom: 17
		});
		var layer = new L.TileLayer.MBTiles(db, { tms: true });

		map.addLayer(layer);
	}
	//*/
};

app.initialize();
