var gOsmServerMap;
var gOsmServerDataToSend = [];

function mapOnDocumentHideAll(){
  $(".leaflet-draw-toolbar").hide();
  $(".mapPanelSaveCancelButtons").hide();
}

function mapOnDocumentModifyClick(){
  $(".leaflet-draw-toolbar").show();
  $(".mapPanelSaveCancelButtons").show();
  $(".panelControlMainButtons").hide();
}

function mapOnDocumentRegisterFunc(){
  StateMachine.AddEvent( 'map:modifyClick', mapOnDocumentModifyClick );
}

function mapOnDocumentReady(){
  // cria o mapa
  var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {maxZoom: 19, attribution: osmAttrib}),
    gOsmServerMap = new L.Map('map', {layers: [osm], center: new L.LatLng( -27.50737, -48.51300 ), zoom: 18 });

  // barra de ferramentas
  var drawnItems = new L.FeatureGroup();
  gOsmServerMap.addLayer( drawnItems );

  // Barra personalizada
  var optionsControl =  L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (gOsmServerMap) {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom ui small vertical icon buttons panelControlMainButtons');
      $(container).html(
        '<button class="ui basic button smallButton borda mapPanelSearch">' +
          '<i class="Search icon iconMapSearch"></i>' +
        '</button>' +
        '<button class="ui basic button smallButton borda mapPanelMaximize">' +
          '<i class="Maximize icon"></i>' +
        '</button>' +
        '<button class="ui basic button smallButton borda mapPanelModify">' +
          '<i class="Object Group icon"></i>' +
        '</button>'
        //'<button class="ui basic button smallButton mapPanelConfigure">' +
        //  '<i class="Configure icon"></i>' +
        //'</button>'
      );
      container.style.backgroundColor = '#fafafa';
      return container;
    }
  });
  gOsmServerMap.addControl( new optionsControl() );

  // Barra personalizada
  optionsControl =  L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (gOsmServerMap) {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom ui small vertical icon buttons mapPanelSaveCancelButtons');
      $(container).html(
        '<button class="ui basic button smallButton borda mapPanelClose">' +
          '<i class="Remove icon"></i>' +
        '</button>' +
        '<button class="ui basic button smallButton mapPanelSave">' +
          '<i class="Save icon"></i>' +
        '</button>'
      );
      container.style.backgroundColor = '#fafafa';
      return container;
    }
  });
  gOsmServerMap.addControl( new optionsControl() );

  // Barra de desenho
  var drawControl = new L.Control.Draw({
    position: 'topleft',
    edit: {
      featureGroup: drawnItems,
      remove: true
    }
  });

  var guideLayers = [];
  drawControl.setDrawingOptions({
    polyline: { guideLayers: guideLayers },
    polygon: { guideLayers: guideLayers, snapDistance: 3 }
    //marker: { guideLayers: guideLayers, snapVertices: false },
    //rectangle: false,
    //circle: false
  });

  // Prepara os desenhos do mapa para envio
  // Polygon; Rectangle; Circle; Marker | String Layer that was just created. The type of layer this is. One of:
  // polyline; polygon; rectangle; circle; marker Triggered when a new vector or marker has been created.
  gOsmServerMap.on('draw:created', function(e) {
    var type = e.layerType,
      layer = e.layer;

    var geoData = layer.toGeoJSON();
    var inputCoordinates;
    var coordinateList = [];

    if ( type == "polygon" ) {
      inputCoordinates = geoData.geometry;

      for( var i in inputCoordinates.coordinates ){
        for( var c in inputCoordinates.coordinates[i] ){
          coordinateList.push([
            inputCoordinates.coordinates[i][c][0],
            inputCoordinates.coordinates[i][c][1]
          ]);
        }
      }
    }
    else if ( type == "marker" ) {
      inputCoordinates = geoData.geometry.coordinates;
      coordinateList = [
        inputCoordinates[0],
        inputCoordinates[1]
      ];
    }
    else if ( type == "rectangle" ) {
      inputCoordinates = geoData.geometry.coordinates[0];

      //<bottom left coordinates> key 0
      //<upper right coordinates> key 2
      coordinateList = inputCoordinates;
    }
    else if ( type == "polyline" ) {
      coordinateList = geoData.geometry.coordinates;
    }
    else if ( type == "circle" ) {
      coordinateList = [
        geoData.geometry.coordinates[0],
        geoData.geometry.coordinates[1],
        layer.options.radius
      ];
    }

    gOsmServerDataToSend.push({
      PointsList: coordinateList,
      Type: type,
      //IdEmpresa: idEmpresa,
      Id: IdUnique
    });

    StateMachine.Run( 'map:added' );
    layer["IdUnique"] = IdUnique ++;
    drawnItems.addLayer(layer);
  });

  gOsmServerMap.on('click', function(e) {
    StateMachine.Run( 'map:click' );
  });

  gOsmServerMap.on('zoomlevelschange', function( Event ) {
    StateMachine.Run( 'map:zoomlevelschange' );
  });

  gOsmServerMap.on('resize', function( ResizeEvent ) {
    StateMachine.Run( 'map:resize' );
  });

  gOsmServerMap.on('unload', function( Event ) {
    StateMachine.Run( 'map:unload' );
  });

  gOsmServerMap.on('viewreset', function( Event ) {
    StateMachine.Run( 'map:viewreset' );
  });

  gOsmServerMap.on('load', function( Event ) {
    StateMachine.Run( 'map:load' );
  });

  gOsmServerMap.on('zoomstart', function( Event ) {
    StateMachine.Run( 'map:zoomstart' );
  });

  gOsmServerMap.on('movestart', function( Event ) {
    StateMachine.Run( 'map:movestart' );
  });

  gOsmServerMap.on('zoom', function( Event ) {
    StateMachine.Run( 'map:zoom' );
  });

  gOsmServerMap.on('move', function( Event ) {
    StateMachine.Run( 'map:move' );
  });

  gOsmServerMap.on('zoomend', function( Event ) {
    StateMachine.Run( 'map:zoomend' );
  });

  gOsmServerMap.on('moveend', function( Event ) {
    StateMachine.Run( 'map:moveend' );
  });

  // List of all layers just edited on the map. Triggered when layers in the FeatureGroup; initialised with the
  // plugin; have been edited and saved.
  gOsmServerMap.on('draw:edited', function(e) {
    var type = e.layerType,
      layer = e.layer;

    var geoData;
    var inputCoordinates;
    var coordinateList;
    var id;

    for( var layerKey in e.layers._layers ) {
      layerKey = parseInt( layerKey );

      for ( var sendKey in gOsmServerDataToSend) {
        sendKey = parseInt( sendKey );
        if ( gOsmServerDataToSend[sendKey].Id == e.layers._layers[layerKey].IdUnique ) {
          type = gOsmServerDataToSend[sendKey].Type;
          break;
        }
      }

      id = e.layers._layers[layerKey].IdUnique;
      geoData = e.layers._layers[layerKey].toGeoJSON();
      coordinateList = [];

      if (type == "polygon") {
        inputCoordinates = geoData.geometry;

        for (var coordinateKey in inputCoordinates.coordinates) {
          for (var c in inputCoordinates.coordinates[coordinateKey]) {
            coordinateList.push([
              inputCoordinates.coordinates[coordinateKey][c][0],
              inputCoordinates.coordinates[coordinateKey][c][1]
            ]);
          }
        }
      }
      else if (type == "marker") {
        inputCoordinates = geoData.geometry.coordinates;
        coordinateList = [
          inputCoordinates[0],
          inputCoordinates[1]
        ];
      }
      else if (type == "rectangle") {
        inputCoordinates = geoData.geometry.coordinates[0];

        //<bottom left coordinates> key 0
        //<upper right coordinates> key 2
        coordinateList = inputCoordinates;
      }
      else if (type == "polyline") {
        coordinateList = geoData.geometry.coordinates;
      }
      else if (type == "circle") {
        coordinateList = [
          geoData.geometry.coordinates[0],
          geoData.geometry.coordinates[1],
          e.layers._layers[layerKey]._mRadius
        ];
      }

      for ( var sendKey in gOsmServerDataToSend) {
        sendKey = parseInt( sendKey );
        if ( gOsmServerDataToSend[sendKey].Id == e.layers._layers[layerKey].IdUnique ) {
          gOsmServerDataToSend[sendKey].PointsList = coordinateList;
          break;
        }
      }
    }
    StateMachine.Run( 'map:draw:edited' );
  });

  // List of all layers just removed from the map. Triggered when layers have been removed (and saved) from the
  // FeatureGroup.
  gOsmServerMap.on('draw:deleted', function(e) {
    var type = e.layerType;

    for( var layerKey in e.layers._layers ) {
      for ( var sendKey in gOsmServerDataToSend) {
        sendKey = parseInt( sendKey );
        if ( gOsmServerDataToSend[sendKey].Id == e.layers._layers[layerKey].IdUnique ) {
          delete gOsmServerDataToSend[sendKey];
        }
      }
    }

    var newData = [];
    for( var i in gOsmServerDataToSend ){
      if( typeof gOsmServerDataToSend[ i ] == "object" ){
        newData.push( gOsmServerDataToSend[ i ] );
      }
    }
    gOsmServerDataToSend = newData;
    StateMachine.Run( 'map:draw:deleted' );
  });

  // The type of layer this is. One of:polyline; polygon; rectangle; circle; marker Triggered when the user has
  // chosen to draw a particular vector or marker.
  gOsmServerMap.on('draw:drawstart', function(e) {
    StateMachine.Run( 'map:draw:drawstart' );
  });

  // The type of layer this is. One of: polyline; polygon; rectangle; circle; marker Triggered when the user has
  // finished a particular vector or marker.
  gOsmServerMap.on('draw:drawstop', function(e) {
    StateMachine.Run( 'map:draw:drawstop' );
  });

  // List of all layers just being added from the map. Triggered when a vertex is created on a polyline or
  // polygon.
  gOsmServerMap.on('draw:drawvertex', function(e) {
    StateMachine.Run( 'map:draw:drawvertex' );
  });

  // The type of edit this is. One of: edit Triggered when the user starts edit mode by clicking the edit tool
  // button.
  gOsmServerMap.on('draw:editstart', function(e) {
    StateMachine.Run( 'map:draw:editstart' );
  });

  // Layer that was just moved. Triggered as the user moves a rectangle; circle or marker.
  gOsmServerMap.on('draw:editmove', function(e) {
    StateMachine.Run( 'map:draw:editmove' );
  });

  // Layer that was just moved. Triggered as the user resizes a rectangle or circle.
  gOsmServerMap.on('draw:editresize', function(e) {
    StateMachine.Run( 'map:draw:editresize' );
  });

  // List of all layers just being edited from the map. Triggered when a vertex is edited on a polyline or
  // polygon.
  gOsmServerMap.on('draw:editvertex', function(e) {
    StateMachine.Run( 'map:draw:editvertex' );
  });

  // The type of edit this is. One of: edit Triggered when the user has finshed editing (edit mode) and saves
  // edits.
  gOsmServerMap.on('draw:editstop', function(e) {
    StateMachine.Run( 'map:draw:editstop' );
  });

  // The type of edit this is. One of: remove Triggered when the user starts remove mode by clicking the remove
  // tool button.
  gOsmServerMap.on('draw:deletestart', function(e) {
    StateMachine.Run( 'map:draw:deletestart' );
  });

  // The type of edit this is. One of: remove Triggered when the user has finished removing shapes (remove mode)
  // and saves.
  gOsmServerMap.on('draw:deletestop', function(e) {
    StateMachine.Run( 'map:draw:deletestop' );
  });

  $('.mapPanelModify').popup({
    position: 'right center',
    content : 'Adicionar/Remover elementos do mapa',
    onVisible: function( el ){
      StateMachine.Run( 'map:draw:deletestop' );
      $('.mapPanelSearch').popup('hide');
    }
  });

  $('.mapPanelMaximize').popup({
    position: 'right center',
    content : 'Ajustar o zoom do mapa',
    onVisible: function( el ){
      StateMachine.Run( 'map:popup:mapPanelMaximize' );
    }
  });

  $('.mapPanelConfigure').popup({
    position: 'right center',
    content : 'Configurações',
    onVisible: function( el ){
      StateMachine.Run( 'map:popup:mapPanelConfigure' );
    }
  });

  $('.mapPanelClose').popup({
    position: 'right center',
    content : 'Cancela a edição do mapa',
    onVisible: function( el ){
      StateMachine.Run( 'map:popup:mapPanelClose' );
    }
  });

  $('.mapPanelSave').popup({
    position: 'right center',
    content : 'Salva a edição do mapa',
    onVisible: function( el ){
      StateMachine.Run( 'map:popup:mapPanelSave' );
    }
  });

  $('.mapPanelModify').click( function() {
    console.log( 'mapPanelModify' );
    StateMachine.Run( 'map:modifyClick' );
  });

  $('.mapPanelClose').click( function(){
    console.log( 'mapPanelClose' );
    //$(".leaflet-draw-toolbar").hide();
    //$(".panelCancelButtons").hide();
    //$(".mapPanelSaveCancelButtons").show();
  });

  $('.mapPanelSearch').click( function(){
    console.log( 'mapPanelSearch' );
    //$('.mapPanelSearch').popup('show');
  });

  $('.mapPanelSave').click( function(){
    console.log( 'mapPanelSave' );
    //$('.mapPanelSearch').popup('show');
  });

  $('.mapPanelMaximize').click( function(){
    console.log( 'mapPanelMaximize' );
    //$('.mapPanelSearch').popup('show');
  });

  gOsmServerMap.addControl(drawControl);
}