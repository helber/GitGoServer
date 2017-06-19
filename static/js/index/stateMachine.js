var gOsmStateMachine = gOsmStateMachine || {};
var StateMachine = StateMachine || {};

StateMachine.AddEvent = function( name, func ){
  if( gOsmStateMachine[ name ] == undefined ){
    gOsmStateMachine[ name ] = [];
  }

  gOsmStateMachine[ name ].push( func );
};

StateMachine.Run = function( name ){
  if( gOsmStateMachine[ name ] != undefined ){
    for( var i in gOsmStateMachine[ name ] ){
      gOsmStateMachine[ name ][ i ]();
    }
  }
};