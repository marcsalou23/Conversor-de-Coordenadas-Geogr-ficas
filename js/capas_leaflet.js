
//mapa
var map = L.map('map').setView([41.066, 1.06], 14);
//capas
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
var topoicc = L.tileLayer.wms(
						"https://geoserveis.icgc.cat/icc_mapesmultibase/utm/wms/service?", {
							layers: 'topo',
							format: 'image/png',
							transparent: true,
							maxZoom: 25

						}).addTo(map);

var topoicc_opa = L.tileLayer.wms(
						"https://geoserveis.icgc.cat/icc_mapesmultibase/utm/wms/service?", {
							layers: 'topo',
							format: 'image/png',
							transparent: true,
                            opacity:0.5,
							maxZoom: 25

						}).addTo(map);
                
var orto10c =  L.tileLayer.wms("https://geoserveis.icgc.cat/icc_mapesbase/wms/service?", {
							layers: 'orto10c',
//                            crs: crs25831,
							format: 'image/png',
							transparent: true,
							maxZoom: 25
                }); 

var orto25c = L.tileLayer.wms("https://geoserveis.icgc.cat/icc_mapesbase/wms/service?", {
							layers: 'orto25c',
//                            crs: crs25831,
							format: 'image/png',
							transparent: true,
							maxZoom: 25
                }); 

var icc = L.tileLayer("http://geoserveis.icc.cat/icc_mapesbase/wms/service?", {
  layers: 'mtc25m',
  format: 'image/png',
  transparent: true,
  attribution: "Institut Cartogràfic y Geològic de Catalunya"
});

var pnoa = L.tileLayer.wms("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
	   layers: "Catastro",//nombre de la capa (ver get capabilities)
	   format: 'image/jpeg',
	   transparent: true,
	   version: '1.1.1',//wms version (ver get capabilities)
	   attribution: "DIRECCION GENERAL DEL CATASTRO"
	});

var topo_n = L.tileLayer.wms("http://geoserveis.icc.cat/icc_bt25m/wms/service", {
							layers: 'icc_bt25m',
//                            crs: crs25831,
							format: 'image/png',
							transparent: true,
							maxZoom: 25
                }); 
 
 
	
//crearemos un diccionario baseMaps
var baseMaps = {
    "ICC topográfico": topoicc,
    "ICC ortofoto 10": orto10c,
    "ICC ortofoto 25": orto25c,
    "Catastro": pnoa,
 
};

//la opción onEachFeature donde indicamos que ejecute una función anónima cada vez que se añada un nuevo elemento a la capa parques. Para los JSON
var campings = L.geoJSON(campingsjson, {
    onEachFeature: function(feature, layer){
        layer.bindPopup("<b>Nombre:</b> "+feature.properties.nombre+"<br><b>Descripción:</b> "+feature.properties.descripcion+"<br><b>Tipo:</b> "+feature.properties.tipo);
    }
}).addTo(map);

var overlays = {
    "Topo ICGC": topoicc_opa,
    "Campings": campings,
};
var estiloCirculosNaranja = {
    radius: 8,
    fillColor: "#ef5300",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var estiloCirculosAzul = {
    radius: 8,
    fillColor: "#246ee6",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
//cargar el estilo para el omnivore
var bibliotecas = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, estiloCirculosNaranja);
        }
});

//cargar la capa para omnivore
var hoteles = L.geoJSON(null, {
        
        pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, estiloCirculosAzul);
        }}).bindPopup(function (layer){
            return "<b>Nombre:</b> "+layer.feature.properties.Nombre+"<br><b>Estrellas:</b> "+layer.feature.properties.Estrellas;   
}).addTo(map);
    


omnivore.kml('datos/bibliotecas.kml', null, bibliotecas).addTo(map);
omnivore.kml('datos/hoteles.kml', null, hoteles).addTo(map);





L.control.scale({
    position: "bottomright",
    imperial: false
}).addTo(map);

L.control.layers(baseMaps,overlays).addTo(map);

var capaEdicion = new L.FeatureGroup().addTo(map);

map.on('draw:created', function (evento){
    var layer = evento.layer;
    capaEdicion.addLayer(layer);
});
var pnoa2 = new L.TileLayer(osm, {minZoom: 10, maxZoom: 13});
var miniMap = new L.Control.MiniMap(osm, { toggleDisplay: true }).addTo(map);

var options = {
    draw: { polygon: {
                allowIntersection: false,
                shapeOptions: {
                    color: 'red',
                    weight: 10
                }
            },
            circle:false,
            rectangle: false},
    edit: {featureGroup: capaEdicion}
}
var drawControl = new L.Control.Draw(options).addTo(map);
L.control.polylineMeasure(options).addTo(map);

map.addLayer(hoteles);

var searchControl = new L.Control.Search({
		position:'topright',		
		layer: hoteles,
        propertyName: 'Nombre',
		initial: false,
		zoom: 21,
		marker: false,
        moveToLocation: function(latlng, title, map) {
                //para centrar el punto buscado , no usar el getBounds porque sirve para poligonos o lineas que tiene espacio no lo puntos
  			map.setView(latlng.layer.getLatLng(), 16); // access the zoom
		}
	});


searchControl.on('search:locationfound', function(e) {
		
		console.log('search:locationfound', );

		//map.removeLayer(this._markerSearch)

		e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
		if(e.layer._popup)
			e.layer.openPopup();

	}).on('search:collapsed', function(e) {

		hoteles.eachLayer(function(layer) {	//restore feature color
			hoteles.resetStyle(layer);
		});	
	});

map.addControl( searchControl );	


        
 

