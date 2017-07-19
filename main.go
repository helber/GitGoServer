package main

/*
<tag k="admin_level" v="9"/>
<tag k="boundary" v="administrative"/>
<tag k="name" v="Canasvieiras"/>
<tag k="source" v="PMF, IBGE"/>
<tag k="type" v="boundary"/>
<tag k="wikipedia" v="pt:Canasvieiras"/>

{"tag.name": "Canasvieiras", "tag.place": "suburb"}
{"tag.admin_level":"8", "tag.boundary":"administrative","tag.type":"boundary"}
{"tag.admin_level": "9", "tag.boundary": "administrative", "tag.type":"boundary",  "tag.name": "Canasvieiras"}
 */

//todo rever chaves do banco - urgente
//todo ibge polygons deve ter a distância entre os pontos
//todo geogson tem que ter box para banco com os 4 pontos, tem que ter o tipo original ( node way e relação ), centroid ou ponto na forma de loc - urgente
//todo separar tag - urgente
//todo box tem que ter os quatro pontos - urgente
//todo idParser do gOsm e do gOkmz estão errados - prioridade
//todo fazer um método para apagar downloads - prioridade
//todo 'if bson.IsObjectIdHex( RelationAStt.IdMongo.String() ) == false' para todos os tipos no insert
//todo checkBounds() deve virar global
//todo rever os testes de geoTypePolygon
//todo criar a interface para todos os geoTypes
//todo enable statistic false gera contagem negativa
//todo o servidor deveria ser dividido em dois, um para o painel de controle, sem timeout e outro para o usuário, com timeout.
//todo tem status para descomprimindo o arquivo?
//todo install.FileDownloadTyp colocar se o download é ibge ou geofabrik
//todo rever todos os exemplos que usam pointList{}
//todo ./geodatadownload quando dá erro não retorna o json de erro padrão
//todo procurar por todos os `bson:"IdParser,omitempty"` e mudar para `bson:"idParser,omitempty"`
//todo completar PolygonListStt{} com as funções de banco
//todo rever as chaves de PolygonListStt{} e Polygon{} tag e bbox devem ser adicionadas
//todo remover func ParserRatio() do main
//todo procurar por todos os tagNameLStt.InsertDistinct( collection ) e colocar no novo formato
//todo server.gOkmz.parser.ParserThread - no final da função, adicionar o parser do geojson com o máximo de possibilidades possíveis.
//todo todos os InsertDistinct() devem retornar int 0 ou 1 caso o valor já exista. Ex. geoTypeTagKeyName.InsertDistinct

import (
  log "github.com/helmutkemper/seelog"
  "net/http"
  "github.com/helmutkemper/gOsmServer/restFul"
  "github.com/helmutkemper/gOsm/db"
  "github.com/helmutkemper/gOsmServer/restFulPoint"
  "github.com/helmutkemper/gOsmServer/restFulGps"
  "flag"
  "github.com/helmutkemper/mux"
  "github.com/helmutkemper/sessions"
  "time"
  "github.com/helmutkemper/gOsmServer/Install"
  "github.com/helmutkemper/gOsmServer/leaflet"
  "github.com/helmutkemper/gOsm"
  "github.com/helmutkemper/gOsmServer/information"
  "github.com/helmutkemper/gOsmServer/setupProject"
  "html/template"
  "github.com/helmutkemper/gOsmServer/ibge"
  "github.com/helmutkemper/gOsm/geoMath"
  "github.com/helmutkemper/gOkmz/gOkmzConsts"
  "github.com/helmutkemper/mgo/bson"
  "github.com/helmutkemper/gOsm/consts"
  "github.com/helmutkemper/gOkmz"
)

type RoutesStt            []restFul.RouteStt

var Routes                RoutesStt
var AddMapChannel         chan string

func init(){
  AddMapChannel = make( chan string, 20 )
}

var store *sessions.CookieStore

func ParserRatio(w http.ResponseWriter, r *http.Request) {
  output := restFul.JSonOutStt{}
  output.ToOutput( 1, nil, gOsm.GetStatus(), w )
}

func Index(w http.ResponseWriter, r *http.Request) {
  t := template.New("some template") // Create a template.
  t, _ = t.ParseFiles("./templates/index/index.html")  // Parse template file.
  t.ExecuteTemplate(w, "index", nil)  // merge.
}

func geoJSonDb(w http.ResponseWriter, r *http.Request) {
  var out geoMath.GeoJSonList = geoMath.GeoJSonList{}

  out.ServerOutFindFeature(
    w,
    consts.DB_OSM_FILE_WAYS_COLLECTIONS,
    bson.M{
      "$or": []bson.M{
      {"id": 434941249},
      {"id": 133753590},
      {"id": 310550789},
      {"id": 503473805},
      {"id": 503473806},
      {"id": 310551766},
      {"id": 310550784},
      {"id": 314050681},
      {"id": 314050686},
      {"id": 310566770},
      {"id": 311603286},
      {"id": 310566772},
      {"id": 120030903},
      {"id": 120030900},
      {"id": 435887346},
      {"id": 435887353},
      {"id": 435887368},
      {"id": 435887352},
      {"id": 435887357},
      {"id": 119756326},
      {"id": 480107869},
      {"id": 434301946},
      {"id": 480107870},
      {"id": 434301947},
      {"id": 433028918},
      {"id": 435887355},
      {"id": 435887356},
      {"id": 314051120},
        //{"tag.county":"florianopolis"},
        //{"tag.district":"canasvieiras"},
        //{ "tag.neighborhood": "centro" },
        //{ "tag.neighborhood": "agronomica" },
        //{ "tag.neighborhood": "jose mendes" },
        //{ "tag.neighborhood": "saco dos limoes" },
        //{ "tag.neighborhood": "trindade" },
        //{ "tag.neighborhood": "pantanal" },
        //{ "tag.neighborhood": "corrego grande" },
        //{ "tag.neighborhood": "santa monica" },
        //{ "tag.neighborhood": "itacorubi" },
      },
    },
  )
}

func geoJSonDbHull(w http.ResponseWriter, r *http.Request) {
  var out geoMath.GeoJSonList = geoMath.GeoJSonList{}

  out.ServerOutFindFeature(
    w,
    consts.DB_TEST_GEOJSON_CONCAVE_HULL_POLYGONS_COLLECTIONS,
    bson.M{
      "$or": []bson.M{
        {"tag.county":"florianopolis"},
        //{"tag.district":"canasvieiras"},
        //{ "tag.neighborhood": "centro" },
        //{ "tag.neighborhood": "agronomica" },
        //{ "tag.neighborhood": "jose mendes" },
        //{ "tag.neighborhood": "saco dos limoes" },
        //{ "tag.neighborhood": "trindade" },
        //{ "tag.neighborhood": "pantanal" },
        //{ "tag.neighborhood": "corrego grande" },
        //{ "tag.neighborhood": "santa monica" },
        //{ "tag.neighborhood": "itacorubi" },
      },
    },
  )
}

func geoJSon(w http.ResponseWriter, r *http.Request) {

  gOsm.StatisticsEnable( false )
  gOsm.ParserOsmXml( "/home/hkemper/Desktop/brasil_novo/brazil-latest.osm" )
  //gOsm.ParserOsmXml( "/home/kemper/Documents/ahgora/importMap/brazil-latest.osm" )
  return


  var polygon geoMath.PolygonListStt = geoMath.PolygonListStt{}
  err := polygon.Find( gOkmzConsts.DB_IBGE_FILE_POLYGONS_COLLECTIONS, bson.M{ "$or": []bson.M{ { "tag.district": "centro" }, { "tag.district": "arnopolis" }, { "tag.district": "alfredo wagner" }, { "tag.district": "agronomica" }, { "tag.county": "abdon batista" }, { "tag.district": "abelardo luz" }, { "tag.district": "agrolandia" } } } )
  //err := polygon.Find( gOkmzConsts.DB_IBGE_FILE_POLYGONS_COLLECTIONS, bson.M{} )
  if err != nil {
    log.Criticalf( "main.geoJSon.query.error: %v", err )
  }
  //botton left -28.112759, -49.369712
  //upper right -27.092948, -48.144736


  var multiPolygon geoMath.PolygonListStt = geoMath.PolygonListStt{}
  multiPolygon.List = polygon.List

  var geoJSon geoMath.GeoJSon = geoMath.GeoJSon{}
  geoJSon.Init()
  geoJSon.AddTag( "test", "ExampleGeoJSon_FindOne" )
  geoJSon.AddGeoMathPolygonList( "01", &multiPolygon )
  geoJSon.MakeBoundingBox()
  geoJSon.ServerOut( w )
  /*
  geoJSon.Insert( consts.DB_TEST_GEOJSON_POLYGONS_COLLECTIONS, consts.DB_TEST_GEOJSON_POLYGONS_TAGS_COLLECTIONS )

  var geoJSonDb geoMath.GeoJSon = geoMath.GeoJSon{}
  geoJSonDb.FindOne( consts.DB_TEST_GEOJSON_POLYGONS_COLLECTIONS, bson.M{ "tag.test": "ExampleGeoJSon_FindOne" } )
  */
}

func onLoadConfig() {
  install.Initialize( setupProject.Config.Server.StaticFileSysPath )

  ibge.FuzzySearchNeighborhoodClear()
  ibge.FuzzySearchDistrictClear()
  ibge.FuzzySearchCountyClear()

  if setupProject.Config.Fuzzy.IbgeNeighborhoodInitialize == true {
    ibge.FuzzySearchNeighborhoodInit()
  }

  if setupProject.Config.Fuzzy.IbgeDistrictInitialize == true {
    ibge.FuzzySearchDistrictInit()
  }

  if setupProject.Config.Fuzzy.IbgeCountyInitialize == true {
    ibge.FuzzySearchCountyInit()
  }
}

func main() {
  // db connect
  db.Connect( "127.0.0.1", "20170617" )

  // configuration from database
  setupProject.Config = setupProject.Configuration{}
  setupProject.Config.AddOnConfigFunc( onLoadConfig )
  setupProject.Config.LoadConfig()

  gOkmz.EnableGeoJSon( setupProject.Config.Ibge.MakeGeoJSon )
  gOkmz.EnableConcaveHull( setupProject.Config.Ibge.MakeConcaveHull, setupProject.Config.Ibge.MakeGeoJSonConcaveHull )
  gOkmz.EnableConvexHull( setupProject.Config.Ibge.MakeConcaveHull, setupProject.Config.Ibge.MakeConvexHullDistance, setupProject.Config.Ibge.MakeGeoJSonConvexHull )

  // server pages
  Routes = RoutesStt{
    // index
    restFul.RouteStt{
      Name:        "index",
      Method:      "GET",
      Pattern:     "/",
      HandlerFunc: Index,
    },

    // geoJSon
    restFul.RouteStt{
      Name:        "js",
      Method:      "GET",
      Pattern:     "/bolivia",
      HandlerFunc: geoJSon,
    },

    // geoJSon
    restFul.RouteStt{
      Name:        "js",
      Method:      "GET",
      Pattern:     "/js.js",
      HandlerFunc: geoJSonDb,
    },

    // geoJSon
    restFul.RouteStt{
      Name:        "jsHull",
      Method:      "GET",
      Pattern:     "/jsHull",
      HandlerFunc: geoJSonDbHull,
    },

    // Mostra o percentual dos dados processados
    restFul.RouteStt{
      Name: "statistic",
      Method: "GET",
      Pattern: "/parserratio",
      HandlerFunc: ParserRatio,
    },

    // Download osm xml from geofabrik
    // Download osm xml from ibge
    // json to send: { "continent": string, "name": string }
    // Ex.: { "continent": "south-america", "name": "Brazil" }
    // Ex.: { "continent": "south-america", "name": "25-PB.kmz" }
    // Ex.: { "continent": "south-america", "name": "42-SC.kmz" }
    restFul.RouteStt{
      Name: "DownloadGeoData",
      Method: "POST",
      Pattern: "/geodatadownload",
      HandlerFunc: install.DownloadMapData,
    },

    // Atualiza os dados do banco com as informações dos mapas da geo fabrik
    restFul.RouteStt{
      Name: "UpdateDownloadGeoFabrik",
      Method: "GET",
      Pattern: "/updategeofabrikdatadownload",
      HandlerFunc: install.UpdateGeoFabrikMapListToDownload,
    },

    // Atualiza os dados do banco com as informações dos mapas do IBGE
    restFul.RouteStt{
      Name: "ibge",
      Method: "GET",
      Pattern: "/updateibgedatadownload",
      HandlerFunc: install.UpdateIbgeMapListToDownload,
    },

    // Mostra os dados colhidos por install.UpdateGeoFabrikMapListToDownload
    // a medida que os mesmos ficam prontos
    // funciona bem para o geofabrik e para o ibge
    // todo "IdMongo": "", ??????????????
    restFul.RouteStt{
      Name: "ProgressDownloadGeoFabrik",
      Method: "GET",
      Pattern: "/progressgeodatadownload",
      HandlerFunc: install.ProgressDownloadMapData,
    },

    // Monitora o download do arquivo de mapas escolhido
    // funciona bem para o geofabrik e não funciona para o ibge por ser ftp
    restFul.RouteStt{
      Name: "ProgressDownloadOsm",
      Method: "GET",
      Pattern: "/progressdownloadosm",
      HandlerFunc: install.ProgressDownloadFile,
    },

    // Mostra a alocação de memória
    restFul.RouteStt{
      Name: "MemoryAlloc",
      Method: "GET",
      Pattern: "/memory",
      HandlerFunc: information.MemoryAlloc,
    },

    restFul.RouteStt{
      Name: "gpsCreate",
      Method: "POST",
      Pattern: "/gps",
      HandlerFunc: restFulGps.SetGpsPoint,
    },
    restFul.RouteStt{
      Name: "getPointByOsmId",
      Method: "GET",
      Pattern: "/point/{id:[0-9]{1,23}}",
      HandlerFunc: restFulPoint.GetPointById,
    },
    restFul.RouteStt{
      Name: "getPointByMongoId",
      Method: "GET",
      Pattern: "/point/{id:[0-9a-fA-F]{24}}",
      HandlerFunc: restFulPoint.GetPointByIdMongo,
    },
    restFul.RouteStt{
      Name: "getPoints",
      Method: "POST",
      Pattern: "/getPoints",
      HandlerFunc: leaflet.GetPoints,
    },
    restFul.RouteStt{
      Name: "getPro",
      Method: "POST",
      Pattern: "/getProx",
      HandlerFunc: leaflet.GetProximidades,
    },

    // Recarrega as configurações do sistema
    restFul.RouteStt{
      Name:        "reconfigure",
      Method:      "GET",
      Pattern:     "/reconfigure",
      HandlerFunc: setupProject.Reload,
    },

    restFul.RouteStt{
      Name:        "reconfigure",
      Method:      "GET",
      Pattern:     "/loggeron",
      HandlerFunc: setupProject.LogOn,
    },

    restFul.RouteStt{
      Name:        "reconfigure",
      Method:      "GET",
      Pattern:     "/loggeroff",
      HandlerFunc: setupProject.LogOff,
    },

    // Procura pelo bairro
    restFul.RouteStt{
      Name:        "neighborhoodName",
      Method:      "GET",
      Pattern:     "/neighborhoodName/{search:.*}",
      HandlerFunc: ibge.FuzzySearchNeighborhood,
    },

    // Procura pelo distrito
    restFul.RouteStt{
      Name:        "districtName",
      Method:      "GET",
      Pattern:     "/districtName/{search:.*}",
      HandlerFunc: ibge.FuzzySearchDistrict,
    },

    // Procura pelo município
    restFul.RouteStt{
      Name:        "county",
      Method:      "GET",
      Pattern:     "/countyName/{search:.*}",
      HandlerFunc: ibge.FuzzySearchCounty,
    },
  }

  store = sessions.NewCookieStore([]byte( setupProject.Config.Server.CookieName ))
  store.Options = &sessions.Options{
    Path: setupProject.Config.Server.Path,
    Domain: setupProject.Config.Server.Domain,
    MaxAge: setupProject.Config.Server.MaxAge,
    Secure: setupProject.Config.Server.Secure,
    HttpOnly: setupProject.Config.Server.HttpOnly,
  }

  if setupProject.Config.Ibge.MakeConvexHull == false && setupProject.Config.Ibge.MakeGeoJSonConvexHull == true {
    log.Critical( "For 'setupProject.Config.Ibge.MakeGeoJSonConvexHull' to be true, 'setupProject.Config.Ibge.MakeConvexHull' must be true" )
  }

  if setupProject.Config.Ibge.MakeConcaveHull == false && setupProject.Config.Ibge.MakeGeoJSonConcaveHull == true {
    log.Critical( "For 'setupProject.Config.Ibge.MakeGeoJSonConcaveHull' to be true, 'setupProject.Config.Ibge.MakeConcaveHull' must be true" )
  }

  router := mux.NewRouter().StrictSlash( true )
  for _, route := range Routes {
    var handler http.Handler

    handler = route.HandlerFunc
    handler = Logger( handler, route.Name )

    router.
    Methods(route.Method).
      Path(route.Pattern).
      Name(route.Name).
      Handler(handler)
  }

  // This will serve files under http://domain.com/static/<filename>
  var dir string
  flag.StringVar( &dir, "dir", setupProject.Config.Server.StaticFileSysPath, "the directory to serve files from." )
  flag.Parse()

  router.PathPrefix( setupProject.Config.Server.StaticServerPath  ).Handler( http.StripPrefix( setupProject.Config.Server.StaticServerPath,  http.FileServer( http.Dir( dir ) ) ) )

  // For use certificated server ( https )
  // openssl genrsa 1024 > host.key
  // chmod 400 host.key
  // openssl req -new -x509 -nodes -sha1 -days 365 -key host.key -out host.cert
  //log.Critical( http.ListenAndServeTLS( ":8082", "host.crt", "host.key", router ) )

  // For uncertificated server ( http )
  log.Critical(http.ListenAndServe(":8082", router))

  //context.ClearHandler(http.DefaultServeMux)
}

func Logger(inner http.Handler, name string) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    start := time.Now()

    inner.ServeHTTP(w, r)

    log.Infof(
      "%s\t%s\t%s\t%s",
      r.Method,
      r.RequestURI,
      name,
      time.Since(start),
    )
  })
}

