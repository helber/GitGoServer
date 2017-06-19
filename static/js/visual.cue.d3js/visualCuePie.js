/**
 *
 * @param setupObject = {
   *  pie: {
   *    mainIconSize: 40,
   *    mainIcon: "\uf21c",
   *    radiusOuterPx: 100,
   *    radiusInnerPx: 50,
   *    mainIconDX: -25,
   *    mainIconDY: -20
   *  }
   * }
 * @param dataObject
 */
function visualCuePieLikeElement( setupObject, dataArrObject ){

  if( setupObject[ "x" ] === undefined ){
    setupObject[ "x" ] = 0;
  }
  if( setupObject[ "y" ] === undefined ){
    setupObject[ "y" ] = 0;
  }
  if( setupObject[ "element" ] === undefined ){
    setupObject[ "element" ] = "body";
  }
  if( setupObject[ "toolTipClass" ] === undefined ){
    setupObject[ "toolTipClass" ] = "tooltip";
  }
  if( setupObject[ "angleStartDeg" ] === undefined ){
    setupObject[ "angleStartDeg" ] = 0;
  }
  if( setupObject[ "angleEndDeg" ] === undefined ){
    setupObject[ "angleEndDeg" ] = 360;
  }
  if( setupObject[ "toolTipEffectInDuration" ] === undefined ){
    setupObject[ "toolTipEffectInDuration" ] = 100;
  }
  if( setupObject[ "toolTipEffectOutDuration" ] === undefined ){
    setupObject[ "toolTipEffectOutDuration" ] = 500;
  }
  if( setupObject[ "toolTipOpacity" ] === undefined ){
    setupObject[ "toolTipOpacity" ] = .8;
  }
  if( setupObject[ "toolTipDX" ] === undefined ){
    setupObject[ "toolTipDX" ] = 0;
  }
  if( setupObject[ "toolTipDY" ] === undefined ){
    setupObject[ "toolTipDY" ] = 0;
  }
  if( setupObject[ "toolTipFillColor" ] === undefined ){
    setupObject[ "toolTipFillColor" ] = "#888888";
  }
  /*if( setupObject[ "mainIconSize" ] === undefined ){
   setupObject[ "mainIconSize" ] = 80;
   }*/
  if( setupObject[ "mainIconColor" ] === undefined ){
    setupObject[ "mainIconColor" ] = "#000000";
  }
  if( setupObject[ "mainIconDX" ] === undefined ){
    setupObject[ "mainIconDX" ] = 0;
  }
  if( setupObject[ "mainIconDY" ] === undefined ){
    setupObject[ "mainIconDY" ] = 0;
  }
  /*if( setupObject[ "mainIcon" ] === undefined ){
   setupObject[ "mainIcon" ] = "\uf21c";
   }*/

  var donut = d3.pie()
  .startAngle( setupObject[ "angleStartDeg" ] * ( Math.PI / 180 ) )
  .endAngle( setupObject[ "angleEndDeg" ] * ( Math.PI / 180 ) );

  var arc = d3.arc()
  .innerRadius( setupObject[ "radiusInnerPx" ] )
  .outerRadius( setupObject[ "radiusOuterPx" ] );

  var div = d3.select( setupObject[ "element" ] ).append( "div" )
  .attr( "class", setupObject[ "toolTipClass" ] )
  .style( "opacity", 0 );

  var vis = d3.select( setupObject[ "element" ] )
  .append( "svg:svg" )
  .data( [ dataArrObject ] )
  .attr( "width", setupObject[ "radiusOuterPx" ] * 2 )
  .attr( "height", setupObject[ "radiusOuterPx" ] * 2 );

  var arcs = vis.selectAll( "g.arc" )
  .data( donut.value(
    function( d ) {
      return d.percentual;
    }
  ))
  .enter().append( "svg:g" )
  .attr( "class", "arc" )
  .attr( "transform", "translate(" + ( setupObject[ "radiusOuterPx" ] + setupObject[ "x" ] ) + "," + ( setupObject[ "radiusOuterPx" ] + setupObject[ "y" ] ) + ")" )
  .on( "mousemove", function( d ) {
    div.transition()
    .duration( setupObject[ "toolTipEffectInDuration" ] )
    .style( "opacity", setupObject[ "toolTipOpacity" ] );

    div.html( d.data.status )
    .style( "left", ( d3.event.pageX + setupObject[ "toolTipDX" ] ) + "px" )
    .style( "top", ( d3.event.pageY + setupObject[ "toolTipDY" ] ) + "px" );
  })
  .on( "mouseout", function( d ) {
    div.transition()
    .duration( setupObject[ "toolTipEffectOutDuration" ] )
    .style( "opacity", 0 );
  });

  arcs.append( "svg:path" )
  .attr( "fill", function( d, i ) {
    return d.data.background;
  })
  .attr( "d", arc );

  arcs.append( "svg:foreignObject" )
  .attr( "font-family", "FontAwesome" )
  .attr( 'font-size', function( d ) {
    return ( d.data.size ) + 'px'
  })
  .attr( 'color', function( d ) {
    return d.data.color
  })
  .attr( "transform", function( d ) {
    var textWidth = getTextWidth( d.data.icon, "FontAwesome" );
    return "translate(" + ( arc.centroid( d )[ 0 ] - textWidth / 2 + d.data.dx ) + "," + ( arc.centroid( d )[ 1 ] - textWidth / 2 + d.data.dy ) + ")";
  })
  .attr( "text-anchor", function( d ) {
    return ( d.endAngle + d.startAngle ) / 2 > Math.PI ? "end" : "start";
  })
  .text( function( d ) {
    return d.data.icon;
  })
  .attr( 'pointer-events', 'none' );

  vis.append( "circle" )
  .attr( "cx", function( d ) {
    return setupObject[ "radiusOuterPx" ] + setupObject[ "x" ];
  })
  .attr( "cy", function( d ) {
    return setupObject[ "radiusOuterPx" ] + setupObject[ "y" ];
  })
  .attr( "r", setupObject[ "radiusInnerPx" ] )
  .style( "fill", setupObject[ "toolTipFillColor" ] )
  .on( "mousemove", function( d ) {
    div.transition()
    .duration( setupObject[ "toolTipEffectInDuration" ] )
    .style( "opacity", setupObject[ "toolTipOpacity" ] );
    div.html( "Olá mundo!" )
    .style("left", ( d3.event.pageX + setupObject[ "toolTipDX" ] ) + "px")
    .style("top", ( d3.event.pageY + setupObject[ "toolTipDY" ] ) + "px");
  })
  .on( "mouseout", function( d ) {
    div.transition()
    .duration( setupObject[ "toolTipEffectOutDuration" ] )
    .style( "opacity", 0 );
  });
  vis.append( "svg:foreignObject" )
  .attr( "font-family", "FontAwesome" )
  .attr( 'font-size', function( d ) {
    return ( setupObject[ "mainIconSize" ] ) + 'px'
  })
  .attr( 'pointer-events', 'none' )
  .attr( 'color', function( d ) {
    return setupObject[ "mainIconColor" ];
  })
  .attr("x", function( d ) {
    return ( setupObject[ "radiusOuterPx" ] + setupObject[ "mainIconDX" ] + setupObject[ "x" ] );
  })
  .attr("y", function( d ) {
    return ( setupObject[ "radiusOuterPx" ] + setupObject[ "mainIconDY" ] + setupObject[ "y" ] );
  })
  .text( setupObject[ "mainIcon" ] );

  return {
    vis: vis,
    html: div
  };
}