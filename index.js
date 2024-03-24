var map = L.map('map').setView([50.84833, 5.68889], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 12,
    bounds: [[50.937014, 5.381927], [50.762328, 5.993729]],
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.pm.addControls({  
    position: 'topleft',
    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: false,
    drawRectangle: false,
    drawCircle: false,
    drawText: false,
    cutPolygon: false,
    rotateMode: false
});

map.pm.Toolbar.createCustomControl({
	name: 'StoreShapes', 
	title:'Store all shapes',
    block: 'custom',
    className: 'custom-control-icon',
    toggle: false,
    afterClick: ()=>{
        savePolygons(null);
        var data = window.localStorage.polygons;

        var filename = "polygons.json";

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
});

function savePolygons(e) {
    var polygons = [];
    var layers = map.pm.getGeomanLayers(false);
    layers.forEach((layer)=>{
        var shape = layer.toGeoJSON();
        polygons.push(shape);
    });
    window.localStorage["polygons"] = JSON.stringify(polygons);
}

window.addEventListener("beforeunload", savePolygons);

if(localStorage.polygons!=null)
{
    var savedPolygons = JSON.parse(localStorage.polygons)
    savedPolygons.forEach(i => {
        L.geoJSON(i).addTo(map);
    });
}