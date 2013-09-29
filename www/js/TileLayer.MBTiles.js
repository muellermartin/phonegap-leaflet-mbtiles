// inspired by: https://github.com/coomsie/topomap.co.nz/blob/master/Resources/leaflet/TileLayer.DB.js
L.TileLayer.MBTiles = L.TileLayer.extend({
	// SQLitePlugin database
	mbTilesDB: null,

	initialize: function(db, options) {
		console.log('Constructor for L.TileLayer.MBTiles');
		L.Util.setOptions(this, options);

		this.mbTilesDB = db;
	},

	getTileUrl: function(tilePoint, tile) {
		console.log('Requesting tile URL at X: ' + tilePoint.x + ' Y: ' + tilePoint.y + ' Z: ' + tilePoint.z);
		var z = tilePoint.z;
		var x = tilePoint.x;
		var y = tilePoint.y;

		this.mbTilesDB.transaction(function(tx) {
			tx.executeSql('SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?', [z, x, y], function (tx, result) {
				console.log('SQL query executed successfully!');
				tile.src = 'data:image/png;base64,' + result.rows.item(0).tile_data;
			}, function (tx, error){
				console.log('ERROR: ' + error.message);
			});
		});
	},

	_loadTile: function(tile, tilePoint) {
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		this._adjustTilePoint(tilePoint);
		this.getTileUrl(tilePoint, tile);
	}
});
