function uniqueId() {
  var id = new Date().getTime().toString(16);

  id = id.concat( Math.floor((1 + Math.random()) * 0xFFFFFFFFFFFFF).toString(16) );
  id = id.concat( Math.floor((1 + Math.random()) * 0xFFFFFF).toString(16) );

  return id
}