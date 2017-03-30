package main

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
  "github.com/helmutkemper/gOsmServer/setupProject"
  "github.com/helmutkemper/gOsmServer/information"
)

type RoutesStt            []restFul.RouteStt

var Routes                RoutesStt
var AddMapChannel         chan string

var setupConfig           setupProject.Configuration

func init(){
  AddMapChannel = make( chan string, 20 )

  Routes = RoutesStt{
    restFul.RouteStt{
      Name: "statistic",
      Method: "GET",
      Pattern: "/parserratio",
      HandlerFunc: ParserRatio,
    },
    /*restFul.RouteStt{
      Name: "Index",
      Method: "GET",
      Pattern: "/",
      HandlerFunc: Index,
    },*/

    // Download osm xml from geofabrik
    // Download osm xml from ibge
    // json to send: { "continent": string, "name": string }
    // Ex.: { "continent": "south-america", "name": "Brazil" }
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

    // Mostra os dados colhidos por install.UpdateGeoFabrikMapListToDownload a medida que os mesmos ficam prontos
    // todo "IdMongo": "", ??????????????
    restFul.RouteStt{
      Name: "ProgressDownloadGeoFabrik",
      Method: "GET",
      Pattern: "/progressgeodatadownload",
      HandlerFunc: install.ProgressDownloadMapData,
    },

    // Monitora o download do arquivo de mapas escolhido
    restFul.RouteStt{
      Name: "ProgressDownloadOsm",
      Method: "GET",
      Pattern: "/progressdownloadosm",
      HandlerFunc: install.ProgressDownloadOsmFile,
    },

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
    restFul.RouteStt{
      Name:        "reconfigure",
      Method:      "GET",
      Pattern:     "/reconfigure",
      HandlerFunc: setupProject.Reload,
    },




    restFul.RouteStt{
      Name: "ibge",
      Method: "GET",
      Pattern: "/ibge",
      HandlerFunc: install.UpdateIbgeMapListToDownload,
    },
  }

  store.Options = &sessions.Options{
    //Domain:   "localhost",
    Path:     "/",
    MaxAge:   3600 * 8, // 8 hours
    HttpOnly: true,
  }
}
var store = sessions.NewCookieStore([]byte("something-very-secret"))

func ParserRatio(w http.ResponseWriter, r *http.Request) {
  output := restFul.JSonOutStt{}
  output.ToOutput( 1, nil, gOsm.GetStatus(), w )
}

func Index(w http.ResponseWriter, r *http.Request) {

}

func main() {

  db.Connect( "127.0.0.1", "brasil" )

  var dir string

  setupConfig = setupProject.Configuration{}
  setupConfig.LoadConfig()

  flag.StringVar( &dir, "dir", "./static", "the directory to serve files from." )
  flag.Parse()
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
  router.PathPrefix( "/static"  ).Handler( http.StripPrefix( "/static",  http.FileServer( http.Dir( dir ) ) ) )
  router.PathPrefix( "/static/" ).Handler( http.StripPrefix( "/static/", http.FileServer( http.Dir( dir ) ) ) )
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
