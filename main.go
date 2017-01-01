package main

import (
  "log"
  "net/http"
  "github.com/helmutkemper/gOsmServer/restFul"
  "github.com/helmutkemper/gOsm/db"
  "github.com/helmutkemper/gOsmServer/restFulPoint"
  "github.com/helmutkemper/gOsmServer/restFulGps"
  "flag"
  "github.com/gorilla/mux"
  "github.com/gorilla/sessions"
  "time"
  "github.com/helmutkemper/GoSemanticUI/smt"
  "github.com/helmutkemper/gOsmServer/Install"
  "github.com/helmutkemper/GoSemanticUI/smt/smtTemplate"
  "github.com/helmutkemper/gOsmServer/leaflet"
  "gopkg.in/mgo.v2/bson"
  "github.com/helmutkemper/GoSemanticUI/semantic/smLinks"
  "github.com/helmutkemper/gOsm"
  "fmt"
)

type RoutesStt []restFul.RouteStt

var Routes RoutesStt
var AddMapChannel chan string

func init(){
  AddMapChannel = make( chan string, 20 )

  Routes = RoutesStt{
    restFul.RouteStt{
      Name: "import",
      Method: "GET",
      Pattern: "/import",
      HandlerFunc: Import,
    },
    restFul.RouteStt{
      Name: "statistic",
      Method: "GET",
      Pattern: "/statistic",
      HandlerFunc: Statistics,
    },
    restFul.RouteStt{
      Name: "Index1",
      Method: "GET",
      Pattern: "/",
      HandlerFunc: Index,
    },
    restFul.RouteStt{
      Name: "Index2",
      Method: "GET",
      Pattern: "",
      HandlerFunc: Index,
    },
    restFul.RouteStt{
      Name: "DownloadGeoFabrik",
      Method: "POST",
      Pattern: "/geodatadownload",
      HandlerFunc: install.DownloadMapData,
    },
    restFul.RouteStt{
      Name: "UpdateDownloadGeoFabrik",
      Method: "GET",
      Pattern: "/updategeodatadownload",
      HandlerFunc: install.UploadDownloadMapData,
    },
    restFul.RouteStt{
      Name: "ProgressDownloadGeoFabrik",
      Method: "GET",
      Pattern: "/progressgeodatadownload",
      HandlerFunc: install.ProgressDownloadMapData,
    },
    restFul.RouteStt{
      Name: "ProgressDownloadOsm",
      Method: "GET",
      Pattern: "/progressdownloadosm",
      HandlerFunc: install.ProgressDownloadOsm,
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
      Name: "se",
      Method: "GET",
      Pattern: "/se",
      HandlerFunc: Semantic,
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

func Semantic(w http.ResponseWriter, r *http.Request) {
  t := smtTemplate.Template{
    Name: "semantic",
    Out: w,
  }
  t.ParserString( smLinks.GetLinks() )
  t.Execute( nil )
}

func Import(w http.ResponseWriter, r *http.Request) {
  t0 := time.Now()

  db.Connect( "127.0.0.1", "brasil" )

  gOsm.StatisticsEnable( true )
  e := gOsm.ParserOsmXml( "/home/hkemper/Desktop/importMap/south-america-latest.osm" )
  if e != nil {
    panic( e )
  }

  t1 := time.Now()
  fmt.Printf("Total time: %v\n", t1.Sub(t0))
}

func Statistics(w http.ResponseWriter, r *http.Request) {
  output := restFul.JSonOutStt{}
  output.ToOutput( 1, nil, gOsm.GetStatus(), w )
}
































func Index(w http.ResponseWriter, r *http.Request) {
  var smtHeader smt.Header

  smtHeader = smt.Header{}

  smtHeader.SetTitle( "Mapa" )
  smtHeader.AddFw()
  smtHeader.AddMap( "map", -27.427747,-48.45936, 17 )

  session, err := store.Get(r, "demo")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  if session.Values["uniqueId"] == nil {
    session.Values["uniqueId"] = bson.NewObjectId().Hex()
    err = session.Save(r, w)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
  }

  t := smtTemplate.Template{
    Name: "index",
    Out: w,
  }

  /*var icon smt.Icon = smt.Icon{
    Name: smt.ICON_NAME_ADD_CIRCLE,
    Variations: []smt.Variation{ smt.ICON_VARIATION_BORDERED },
    Color: smt.COLOR_BLUE,
    Size: smt.SIZE_BIG,
  }

  t.ParserString( icon.Get() )
  t.ExecuteTemplate( "icon", icon )*/

  var button smt.Button = smt.Button{
    Label: "Ok",
    Primary: true,
    ContentHidden: smt.Content{
      RightIcon: true,
      Text: "Mundo",
      Icon: smt.Icon{
        Name: smt.ICON_NAME_ADD_CIRCLE,
        Variations: []smt.Variation{ smt.ICON_VARIATION_BORDERED },
        Color: smt.COLOR_BLUE,
        Size: smt.SIZE_NORMAL,
      },
    },
    ContentVisible: smt.Content{
      RightIcon: false,
      Text: "Olá",
      Icon: smt.Icon{
        Name: smt.ICON_NAME_ADD_CIRCLE,
        Variations: []smt.Variation{smt.ICON_VARIATION_BORDERED },
        Color: smt.COLOR_BLUE,
        Size: smt.SIZE_NORMAL,
      },
    },
  }

  t.ParserString( button.String() )
  t.ExecuteTemplate( "button", button )


  //t.Execute( icon )
  //t.ParserFiles(
  //  "./templates/index/header.html",
  //)
  //t.ExecuteTemplate( "header", nil )


}

func TodoIndex(w http.ResponseWriter, r *http.Request) {

}

func TodoCreate(w http.ResponseWriter, r *http.Request) {

}

func main() {

  db.Connect( "127.0.0.1", "brasil" )

  var dir string

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
  log.Fatal(http.ListenAndServe(":8082", router))
  //context.ClearHandler(http.DefaultServeMux)
}

func Logger(inner http.Handler, name string) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    start := time.Now()

    inner.ServeHTTP(w, r)

    log.Printf(
      "%s\t%s\t%s\t%s",
      r.Method,
      r.RequestURI,
      name,
      time.Since(start),
    )
  })
}