/*
 // cria o mapa
 var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
 osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
 osm = L.tileLayer(osmUrl, {maxZoom: 19, attribution: osmAttrib});
 map = new L.Map('map', {layers: [osm], center: new L.LatLng( -27.439052, -48.495719 ), zoom: 8 });

 p1 = new MapDrawProjection( map, "./js" );
*/
class MapDrawProjection{
  constructor( map, url ){
    this.svgMainRef = undefined;
    this.svgGRef = undefined;
    this.jsonData = undefined;
    this.collection = undefined;
    this.feature = undefined;
    this.path = undefined;
    this.map = undefined;

    if( map !== undefined ){
      this.setMap( map );
    }

    if( url !== undefined && map !== undefined ){
      this.load( url );
    }
  }

  setMap( map ){
    this.map = map;

    this.svgMainRef = d3.select( this.map.getPanes().overlayPane ).append( "svg" );
    this.svgGRef = this.svgMainRef.append( "g" ).attr( "class", "leaflet-zoom-hide" );
  }

  setTransform( transform ){
    this.transform = transform;
  }

  setSvgMainRef( svgMainRef ){
    this.svgMainRef = svgMainRef;
  }

  setSvgGRef( svgGRef ){
    this.svgGRef = svgGRef;
  }

  setJSon( jsonData ){
    this.jsonData = jsonData;
  }

  setCollection( collection ){
    this.collection = collection;
  }

  setFeature( feature ){
    this.feature = feature;
  }

  setPath( path ){
    this.path = path;
  }

  projectPoint( x, y ) {
    var point = map.latLngToLayerPoint( new L.LatLng( y, x ) );
    this.stream.point( point.x, point.y );
  }

  load( url ){
    d3.json( url, function( error, collection ){} )
    .on( 'load', this.__load.bind( this ) );
  }

  __load( collection ) {
    this.collection = collection;
    this.transform = d3.geoTransform({ point: this.projectPoint });
    this.path = d3.geoPath().projection( this.transform );

    this.feature = this.svgGRef.selectAll( "path" )
    .data( collection.features )
    .enter().append( "path" )
    .attr( "fill", "#ff0000" )
    .attr( "fill-opacity", 0.1 )
    //.attr( "stroke-width", 2 )
    //.attr( "stroke", "#FF0000" )
    .attr( "opacity", 1 );

    this.onChange();
  }

  onChange(){
    var bounds = this.path.bounds( this.collection ),
      topLeft = bounds[ 0 ],
      bottomRight = bounds[ 1 ];

    this.svgMainRef.attr( "width", bottomRight[ 0 ] - topLeft[ 0 ] )
    .attr( "height", bottomRight[ 1 ] - topLeft[ 1 ] )
    .style( "left", topLeft[ 0 ] + "px" )
    .style( "top", topLeft[ 1 ] + "px" );

    this.svgMainRef.attr( "transform", "translate(" + -topLeft[ 0 ] + "," + -topLeft[ 1 ] + ")");

    this.feature.attr( "d", this.path );
  }
}