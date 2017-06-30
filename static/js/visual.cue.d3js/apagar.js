var data = [
  { percentual: 33, icon: '\uf2c8', status: "temperatura", background: "#ff0000", color: "#FFFFFF", size: 30, dx:   0, dy:  0 },
  { percentual: 33, icon: '\uf2a3', status: "mãos",        background: "#00ff00", color: "#FFFFFF", size: 30, dx: -14, dy: -12 },
  { percentual: 33, icon: '\uf243', status: "bateria",     background: "#0000ff", color: "#FFFFFF", size: 20, dx: -14, dy:  0 }
];
var setup = {
  element: document.getElementById( "d31" ),
  mainIconSize: 40,
  mainIcon: "\uf21c",
  radiusOuterPx: 100,
  radiusInnerPx: 50,
  mainIconDX: -25,
  mainIconDY: -20
};


//var a = visualCuePieLikeElement( setup, data );
//var b = visualCuePieLikeElement( setup, data );

//b.vis.remove();