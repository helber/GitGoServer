var gOsmServerOnSearchCount  = 0;
var gOsmServerOnSearchOpen   = false;
var iconName = '';

function gOsmServerOnSearchPopUpHide(){
  gOsmServerOnSearchOpen = false;
  $('.mapPanelSearch').popup('hide');
}


function gOsmServerOnSearchInputFocusHide(){
  if( !$('.prompt').is(':focus') ){
    $('.mapPanelSearch').popup('hide');
  }

  if( gOsmServerOnSearchCount >= 3 ){
    gOsmServerOnSearchOpen = false;
    $('.mapPanelSearch').popup('hide');
  }

}

function gOsmServerOnSearchRegisterFunc(){
  StateMachine.AddEvent( 'map:click', gOsmServerOnSearchInputFocusHide );
  StateMachine.AddEvent( 'map:zoomlevelschange', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:resize', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:unload', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:viewreset', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:load', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:zoomstart', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:movestart', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:zoom', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:move', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:zoomend', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:moveend', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:edited', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:deleted', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:drawstart', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:drawstop', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:drawvertex', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:editmove', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:editresize', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:editvertex', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:editstop', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:deletestart', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:draw:deletestop', gOsmServerOnSearchPopUpHide );

  StateMachine.AddEvent( 'map:drawEditRemovePopupShow', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:drawEditEditPopupShow', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:drawEditMarkerPopupShow', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:drawEditCirclePopupShow', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:drawEditRectanglePopupShow', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:drawEditPolygonPopupShow', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:drawEditPolylinePopupShow', gOsmServerOnSearchPopUpHide );

  StateMachine.AddEvent( 'map:popup:mapPanelMaximize', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:popup:mapPanelConfigure', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:popup:mapPanelClose', gOsmServerOnSearchPopUpHide );
  StateMachine.AddEvent( 'map:popup:mapPanelSave', gOsmServerOnSearchPopUpHide );
}

function gOsmServerOnSearchOnDocumentReady(){

  $('.mapPanelSearch').popup({
    position: 'right center',
    inline: true,
    on: 'hover',
    exclusive: true,
    hoverable: true,
    html: '<span></span>',
    variation: 'wide',
    delay: {
      show: 400,
      hide: 400
    },
    onVisible: function( el ){
      gOsmServerOnSearchOpen = true;
    },
    onHide: function ( el ) {
      if( gOsmServerOnSearchOpen ){
        gOsmServerOnSearchCount += 1;
      }
      else{
        gOsmServerOnSearchCount = 0;
      }

      return !gOsmServerOnSearchOpen;
    },
    onShow: function ( el ) {
      gOsmServerOnSearchOpen = true;
      var actualIcon = 'map';
      var popup = this;
      popup.html('' +
        '<div class="ui multiple icon dropdown button">' +
          '<i class="map icon iconReplace"></i>' +
          '<div class="menu">' +
            '<div class="item">' +
              '<i class="Car icon"></i>Postos de combustível' +
            '</div>' +
            '<div class="item">' +
              '<i class="Map Signs icon"></i>Transporte e estacinamento' +
            '</div>' +
            '<div class="item">' +
              '<i class="Food icon"></i>Alimentação' +
            '</div>' +
            '<div class="item">' +
              '<i class="Money icon"></i>Bancos' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ui search">' +
          '<div class="ui icon input">' +
            '<input class="prompt" type="text" placeholder="Search GitHub">' +
            '<i class="search icon"></i>' +
          '</div>' +
        '</div>');

      $('.dropdown').dropdown({
        action: 'hide',
        //onShow: function(){},
        //onHide: function(){},
        onChange: function(value, text, choice){

          $( '.iconReplace' ).removeClass( actualIcon );

          actualIcon = value.replace( /^(.*?i\s+class=["'])(.*?)( icon["'].*)/, '$2' );
          $( '.iconReplace' ).addClass( actualIcon );

          console.log('value:',value);
          console.log('actualIcon:',actualIcon);
          switch ( actualIcon ){
            case 'money':
              $( '.prompt' ).val('bank');
              break;
            case 'map signs':
              $( '.prompt' ).val('taxi;bus');
              break;
            case 'car':
              $( '.prompt' ).val('fuel;mechanical');
              break;
            case 'food':
              $( '.prompt' ).val('amenity:restaurant;amenity:bar;amenity:cafe');
              break;
          }


          $('.ui.search').search({
            type          : 'category',
            minCharacters : 3,
            apiSettings   : {
              onResponse: function(githubResponse) {
                var
                  response = {
                    results : {}
                  }
                  ;
                // translate GitHub API response to work with search
                $.each(githubResponse.items, function(index, item) {
                  var
                    language   = item.language || 'Unknown',
                    maxResults = 8
                    ;
                  if(index >= maxResults) {
                    return false;
                  }
                  // create new language category
                  if(response.results[language] === undefined) {
                    response.results[language] = {
                      name    : language,
                      results : []
                    };
                  }
                  // add result to category
                  response.results[language].results.push({
                    title       : item.name,
                    description : item.description,
                    url         : item.html_url
                  });
                });
                return response;
              },
              //url: '//api.github.com/search/repositories?q={query}'
              url: '//api.github.com/search/repositories?q=' + actualIcon
            }
          });

          $( '.prompt' ).focus();
        }
      })
    }
  });//.popup('show');

  $('.leaflet-draw-edit-remove').popup({
    position: 'right center',
    onVisible: function( el ){
      StateMachine.Run( 'map:drawEditRemovePopupShow' );
    }
  });

  $('.leaflet-draw-edit-edit').popup({
    position: 'right center',
    onVisible: function( el ){
      StateMachine.Run( 'map:drawEditEditPopupShow' );
    }
  });

  $('.leaflet-draw-draw-marker').popup({
    position: 'right center',
    onVisible: function( el ){
      StateMachine.Run( 'map:drawEditMarkerPopupShow' );
    }
  });

  $('.leaflet-draw-draw-circle').popup({
    position: 'right center',
    onVisible: function( el ){
      StateMachine.Run( 'map:drawEditCirclePopupShow' );
    }
  });

  $('.leaflet-draw-draw-rectangle').popup({
    position: 'right center',
    onVisible: function( el ){
      StateMachine.Run( 'map:drawEditRectanglePopupShow' );
    }
  });

  $('.leaflet-draw-draw-polygon').popup({
    position: 'right center',
    onVisible: function( el ){
      StateMachine.Run( 'map:drawEditPolygonPopupShow' );
    }
  });

  $('.leaflet-draw-draw-polyline').popup({
    position: 'right center',
    onVisible: function( el ){
      StateMachine.Run( 'map:drawEditPolylinePopupShow' );
    }
  });
}