package main

//todo procurar por todos os tagNameLStt.InsertDistinct( collection ) e colocar no novo formato

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
  db.Connect( "127.0.0.1", "brasil" )

  // configuration from database
  setupProject.Config = setupProject.Configuration{}
  setupProject.Config.AddOnConfigFunc( onLoadConfig )
  setupProject.Config.LoadConfig()



  // server pages
  Routes = RoutesStt{
    // index
    restFul.RouteStt{
      Name:        "index",
      Method:      "GET",
      Pattern:     "/",
      HandlerFunc: Index,
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

