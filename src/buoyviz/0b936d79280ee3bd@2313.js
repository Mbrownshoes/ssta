import define1 from "./450051d7f1174df8@254.js";
import define2 from "./a33468b95d0b15b0@808.js";
import define3 from "./94ec544c25860285@1710.js";
import define4 from "./921d584bd92a9817@190.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# MHW Buoys without Globe

used to embed as a module
- curl -o bs.tgz "https://api.observablehq.com/d/0b936d79280ee3bd.tgz?v=3"

- tar -C src/buoyviz -xvzf bs.tgz

To do:

date range brush https://observablehq.com/@observablehq/discovering-date-patterns
`
)});
  main.variable(observer("ind")).define("ind", ["dates","time1"], function(dates,time1){return(
dates.indexOf(time1)
)});
  main.variable(observer("datesCopy")).define("datesCopy", ["dates"], function(dates){return(
[...dates]
)});
  main.variable(observer("datesToPlot")).define("datesToPlot", ["datesCopy","limits"], function(datesCopy,limits)
{
  // run;
  return datesCopy.filter((d) => d >= limits[0] && d <= limits[1]);
}
);
  main.variable(observer("viewof colorView")).define("viewof colorView", ["Inputs"], function(Inputs){return(
Inputs.radio(["anomaly", "heat wave category"], {
  label: "",
  value: "anomaly"
})
)});
  main.variable(observer("colorView")).define("colorView", ["Generators", "viewof colorView"], (G, _) => G.input(_));
  main.variable(observer()).define(["colorView"], function(colorView){return(
colorView
)});
  main.variable(observer("today")).define("today", ["d3"], function(d3){return(
d3.timeDay.offset(d3.utcDay(), -1)
)});
  main.variable(observer("start")).define("start", ["d3","today"], function(d3,today){return(
d3.timeDay.offset(today, -90)
)});
  main.variable(observer()).define(["limits"], function(limits){return(
limits
)});
  main.variable(observer("style")).define("style", ["html"], function(html){return(
html`
<style>
.mapbox-improve-map {
    display: none;
}


</style>
`
)});
  main.variable(observer("viewof limits")).define("viewof limits", ["brushFilterX","d3","dates","start","today"], function(brushFilterX,d3,dates,start,today){return(
brushFilterX(d3.extent(dates), {
  defaultExtent: [
    d3.isoParse(start),
    d3.isoParse(d3.timeDay.offset(today, -20))
  ]
})
)});
  main.variable(observer("limits")).define("limits", ["Generators", "viewof limits"], (G, _) => G.input(_));
  main.variable(observer("viewof time1")).define("viewof time1", ["Scrubber","datesToPlot"], function(Scrubber,datesToPlot){return(
Scrubber(datesToPlot, {
  delay: 250,
  autoplay: false,
  loop: false,
  format: (d) => ""
})
)});
  main.variable(observer("time1")).define("time1", ["Generators", "viewof time1"], (G, _) => G.input(_));
  main.variable(observer("curDate")).define("curDate", ["md","timeFormat","time1"], function(md,timeFormat,time1){return(
md`### ${timeFormat(new Date(time1))}`
)});
  main.variable(observer("viewof map")).define("viewof map", ["projection","width","height","html","mapboxgl","r","mutable siteClicked","invalidation"], function*(projection,width,height,html,mapboxgl,r,$0,invalidation)
{
  let center = projection.invert([width / 2, height / 2]);

  const container = html`<div style="height:${height}px;">`;
  yield container;
  const map = (container.value = new mapboxgl.Map({
    container,
    style: r,
    center: [-129, 51],
    scrollZoom: false,
    zoom: 4
  }));
  // add navigation controls (zoom buttons, pitch & rotate)
  // map.addControl(new mapboxgl.NavigationControl());

  map.on("style.load", function () {
    // Possible position values are 'bottom-left', 'bottom-right', 'top-left', 'top-right'
    map.addControl(
      new mapboxgl.Minimap({
        style: "mapbox://styles/hakai/ckwuxmze164c314pe8hs0s1on",
        center: [-129, 51],
        zoom: 0,
        zoomLevels: []
      }),
      "top-right"
    );
  });

  map.on("load", function () {
    // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on("mouseenter", "hexbins", function (e) {
      map.getCanvas().style.cursor = "default";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      // console.log("properties", properties);
      const catText =
        properties.category === undefined ? "none" : properties.category;
      const description = `${properties.name} <br> 
Heat wave category: ${catText}
      `;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseleave", "hexbins", function () {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("click", "hexbins", function (e) {
      console.log(e);
      $0.value = e.features[0].properties.station;
      container.value.selected = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        data: e.features[0].properties
      };
      container.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    });
  });
  invalidation.then(() => map.remove());

  // Wait until the map loads, then yield the container again.
  yield new Promise((resolve) => {
    if (map.loaded()) resolve(map);
    else map.on("load", () => resolve(map));
  });

  yield container;
}
);
  main.variable(observer("map")).define("map", ["Generators", "viewof map"], (G, _) => G.input(_));
  main.variable(observer("leg")).define("leg", ["colorView","Plot","legend","d3"], function(colorView,Plot,legend,d3)
{
  return colorView === "anomaly"
    ? Plot.legend({
        color: {
          type: "diverging",
          domain: [-4, 4],
          pivot: 0,
          reverse: true,
          legend: true,
          label: "SSTA (°C) →"
        }
      })
    : legend({
        color: d3
          .scaleOrdinal()
          .domain(["Moderate", "Strong", "Severe", "Extreme"])
          .range(["#FEDB67", "#f26722", "#cd3728", "#7E1416"])
      });
}
);
  main.variable(observer("lineChart")).define("lineChart", ["Plot","clickedSite","colors","time1","d3","width","siteClicked","colorView"], function(Plot,clickedSite,colors,time1,d3,width,siteClicked,colorView)
{
  const HWlineChart = Plot.plot({
    height: 250,
    marks: [
      Plot.line(clickedSite, {
        x: "date",
        y: "sst",
        stroke: colors.get("sst"),
        curve: "step",
        strokeWidth: 0.5
      }),
      Plot.line(clickedSite, {
        x: "date",
        y: "thresh",
        stroke: colors.get("thresh"),
        // curve: "step",
        strokeWidth: 0.5
      }),
      Plot.line(clickedSite, {
        x: "date",
        y: "seas",
        stroke: colors.get("seas"),
        // curve: "step",
        strokeWidth: 0.5
      }),
      Plot.areaY(clickedSite, {
        x: "date",
        y1: "thresh",
        y2: "diff",
        sort: "date",
        curve: "step",
        fill: colors.get("moderate")
      }),

      Plot.areaY(clickedSite, {
        x: "date",
        y1: "thresh",
        y2: "diffStrong",
        sort: "date",
        curve: "step",
        fill: colors.get("Strong")
      }),
      Plot.areaY(clickedSite, {
        x: "date",
        y1: "thresh",
        y2: "diffExtreme",
        sort: "date",
        curve: "step",
        fill: colors.get("Extreme")
      }),

      Plot.areaY(clickedSite, {
        x: "date",
        y1: "thresh",
        y2: "diffSevere",
        sort: "date",
        curve: "step",
        fill: colors.get("Severe")
      }),

      // rule at bottom of chart marking y=0;
      Plot.ruleY([0]),

      // vertical rule to mark date/time of event
      Plot.ruleX([time1], {
        stroke: "gray",
        y1: 0,
        y2: d3.max(clickedSite, (d) => d.sst)
      })
    ],

    color: {
      domain: ["above", "below", "avg", "thresh"],
      range: [
        colors.get("above"),
        colors.get("below"),
        colors.get("actuals"),
        colors.get("forecast")
      ]
      // legend: true
    },

    marginLeft: 60,
    width
  });

  const SSTAlineChart = Plot.plot({
    height: 250,
    // y: {
    //   nice: true
    // },
    // x: {
    //   nice: true
    // },
    marks: [
      Plot.dot(clickedSite, {
        x: "date",
        y: "sst",
        stroke: "ssta",
        fill: "ssta"
      }),
      Plot.line(clickedSite, {
        x: "date",
        y: "sst",
        stroke: "#ccc",
        curve: "step",
        strokeWidth: 0.5
      }),
      // vertical rule to mark date/time of event
      Plot.ruleX([time1], {
        stroke: "gray",
        y1: 0,
        y2: d3.max(clickedSite, (d) => d.sst)
      })
    ],
    color: {
      type: "diverging",
      domain: [-4, 4],
      pivot: 0,
      reverse: true
      // legend: true,
      // label: "SSTA (°C) →"
    },
    width
  });
  if (siteClicked !== null)
    return colorView === "anomaly" ? SSTAlineChart : HWlineChart;
}
);
  main.variable(observer("Minimap")).define("Minimap", function(){return(
function Minimap(options) {
  Object.assign(this.options, options);

  this._ticking = false;
  this._lastMouseMoveEvent = null;
  this._parentMap = null;
  this._isDragging = false;
  this._isCursorOverFeature = false;
  this._previousPoint = [0, 0];
  this._currentPoint = [0, 0];
  this._trackingRectCoordinates = [[[], [], [], [], []]];
}
)});
  main.variable(observer("minFunc")).define("minFunc", ["Minimap","mapboxgl"], function(Minimap,mapboxgl)
{
  Minimap.prototype = Object.assign({}, mapboxgl.NavigationControl.prototype, {
    options: {
      id: "mapboxgl-minimap",
      width: "100px",
      height: "80px",
      style: "mapbox://styles/mapbox/streets-v8",
      center: [0, 0],
      zoom: 6,

      // should be a function; will be bound to Minimap
      zoomAdjust: null,

      // if parent map zoom >= 18 and minimap zoom >= 14, set minimap zoom to 16
      zoomLevels: [
        [18, 14, 16],
        [16, 12, 14],
        [14, 10, 12],
        [12, 8, 10],
        [10, 6, 8]
      ],

      lineColor: "#08F",
      lineWidth: 1,
      lineOpacity: 1,

      fillColor: "#F80",
      fillOpacity: 0.25,

      dragPan: false,
      scrollZoom: false,
      boxZoom: false,
      dragRotate: false,
      keyboard: false,
      doubleClickZoom: false,
      touchZoomRotate: false
    },

    onAdd: function (parentMap) {
      this._parentMap = parentMap;

      var opts = this.options;
      var container = (this._container = this._createContainer(parentMap));
      var miniMap = (this._miniMap = new mapboxgl.Map({
        attributionControl: false,
        container: container,
        style: opts.style,
        zoom: opts.zoom,
        center: opts.center
      }));

      if (opts.maxBounds) miniMap.setMaxBounds(opts.maxBounds);

      miniMap.on("load", this._load.bind(this));

      return this._container;
    },

    _load: function () {
      var opts = this.options;
      var parentMap = this._parentMap;
      var miniMap = this._miniMap;
      var interactions = [
        "dragPan",
        "scrollZoom",
        "boxZoom",
        "dragRotate",
        "keyboard",
        "doubleClickZoom",
        "touchZoomRotate"
      ];

      interactions.forEach(function (i) {
        if (opts[i] !== true) {
          miniMap[i].disable();
        }
      });

      if (typeof opts.zoomAdjust === "function") {
        this.options.zoomAdjust = opts.zoomAdjust.bind(this);
      } else if (opts.zoomAdjust === null) {
        this.options.zoomAdjust = this._zoomAdjust.bind(this);
      }

      var bounds = miniMap.getBounds();

      this._convertBoundsToPoints(bounds);

      miniMap.addSource("trackingRect", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {
            name: "trackingRect"
          },
          geometry: {
            type: "Polygon",
            coordinates: this._trackingRectCoordinates
          }
        }
      });

      miniMap.addLayer({
        id: "trackingRectOutline",
        type: "line",
        source: "trackingRect",
        layout: {},
        paint: {
          "line-color": opts.lineColor,
          "line-width": opts.lineWidth,
          "line-opacity": opts.lineOpacity
        }
      });

      // needed for dragging
      miniMap.addLayer({
        id: "trackingRectFill",
        type: "fill",
        source: "trackingRect",
        layout: {},
        paint: {
          "fill-color": opts.fillColor,
          "fill-opacity": opts.fillOpacity
        }
      });

      this._trackingRect = this._miniMap.getSource("trackingRect");

      this._update();

      parentMap.on("move", this._update.bind(this));

      miniMap.on("mousemove", this._mouseMove.bind(this));
      miniMap.on("mousedown", this._mouseDown.bind(this));
      miniMap.on("mouseup", this._mouseUp.bind(this));

      miniMap.on("touchmove", this._mouseMove.bind(this));
      miniMap.on("touchstart", this._mouseDown.bind(this));
      miniMap.on("touchend", this._mouseUp.bind(this));

      this._miniMapCanvas = miniMap.getCanvasContainer();
      this._miniMapCanvas.addEventListener("wheel", this._preventDefault);
      this._miniMapCanvas.addEventListener("mousewheel", this._preventDefault);
    },

    _mouseDown: function (e) {
      if (this._isCursorOverFeature) {
        this._isDragging = true;
        this._previousPoint = this._currentPoint;
        this._currentPoint = [e.lngLat.lng, e.lngLat.lat];
      }
    },

    _mouseMove: function (e) {
      this._ticking = false;

      var miniMap = this._miniMap;
      var features = miniMap.queryRenderedFeatures(e.point, {
        layers: ["trackingRectFill"]
      });

      // don't update if we're still hovering the area
      if (!(this._isCursorOverFeature && features.length > 0)) {
        this._isCursorOverFeature = features.length > 0;
        this._miniMapCanvas.style.cursor = this._isCursorOverFeature
          ? "move"
          : "";
      }

      if (this._isDragging) {
        this._previousPoint = this._currentPoint;
        this._currentPoint = [e.lngLat.lng, e.lngLat.lat];

        var offset = [
          this._previousPoint[0] - this._currentPoint[0],
          this._previousPoint[1] - this._currentPoint[1]
        ];

        var newBounds = this._moveTrackingRect(offset);

        this._parentMap.fitBounds(newBounds, {
          duration: 80,
          noMoveStart: true
        });
      }
    },

    _mouseUp: function () {
      this._isDragging = false;
      this._ticking = false;
    },

    _moveTrackingRect: function (offset) {
      var source = this._trackingRect;
      var data = source._data;
      var bounds = data.properties.bounds;

      bounds._ne.lat -= offset[1];
      bounds._ne.lng -= offset[0];
      bounds._sw.lat -= offset[1];
      bounds._sw.lng -= offset[0];

      this._convertBoundsToPoints(bounds);
      source.setData(data);

      return bounds;
    },

    _setTrackingRectBounds: function (bounds) {
      var source = this._trackingRect;
      var data = source._data;

      data.properties.bounds = bounds;
      this._convertBoundsToPoints(bounds);
      source.setData(data);
    },

    _convertBoundsToPoints: function (bounds) {
      var ne = bounds._ne;
      var sw = bounds._sw;
      var trc = this._trackingRectCoordinates;

      trc[0][0][0] = ne.lng;
      trc[0][0][1] = ne.lat;
      trc[0][1][0] = sw.lng;
      trc[0][1][1] = ne.lat;
      trc[0][2][0] = sw.lng;
      trc[0][2][1] = sw.lat;
      trc[0][3][0] = ne.lng;
      trc[0][3][1] = sw.lat;
      trc[0][4][0] = ne.lng;
      trc[0][4][1] = ne.lat;
    },

    _update: function (e) {
      if (this._isDragging) {
        return;
      }

      var parentBounds = this._parentMap.getBounds();

      this._setTrackingRectBounds(parentBounds);

      if (typeof this.options.zoomAdjust === "function") {
        this.options.zoomAdjust();
      }
    },

    _zoomAdjust: function () {
      var miniMap = this._miniMap;
      var parentMap = this._parentMap;
      var miniZoom = parseInt(miniMap.getZoom(), 10);
      var parentZoom = parseInt(parentMap.getZoom(), 10);
      var levels = this.options.zoomLevels;
      var found = false;

      levels.forEach(function (zoom) {
        if (!found && parentZoom >= zoom[0]) {
          if (miniZoom >= zoom[1]) {
            miniMap.setZoom(zoom[2]);
          }

          miniMap.setCenter(parentMap.getCenter());
          found = true;
        }
      });

      if (!found && miniZoom !== this.options.zoom) {
        if (typeof this.options.bounds === "object") {
          miniMap.fitBounds(this.options.bounds, { duration: 50 });
        }

        miniMap.setZoom(this.options.zoom);
      }
    },

    _createContainer: function (parentMap) {
      var opts = this.options;
      var container = document.createElement("div");

      container.className = "mapboxgl-ctrl-minimap mapboxgl-ctrl";
      container.setAttribute(
        "style",
        "width: " + opts.width + "; height: " + opts.height + ";"
      );
      container.addEventListener("contextmenu", this._preventDefault);

      parentMap.getContainer().appendChild(container);

      if (opts.id !== "") {
        container.id = opts.id;
      }

      return container;
    },

    _preventDefault: function (e) {
      e.preventDefault();
    }
  });

  mapboxgl.Minimap = Minimap;

  return mapboxgl.Minimap;
}
);
  main.define("initial siteClicked", function(){return(
null
)});
  main.variable(observer("mutable siteClicked")).define("mutable siteClicked", ["Mutable", "initial siteClicked"], (M, _) => new M(_));
  main.variable(observer("siteClicked")).define("siteClicked", ["mutable siteClicked"], _ => _.generator);
  main.variable(observer()).define(["md"], function(md){return(
md`Code for globe`
)});
  main.variable(observer("viewof table")).define("viewof table", ["Inputs","clickedSite"], function(Inputs,clickedSite){return(
Inputs.table(clickedSite, {})
)});
  main.variable(observer("table")).define("table", ["Generators", "viewof table"], (G, _) => G.input(_));
  main.variable(observer("clickedSite")).define("clickedSite", ["buoyDailyData","siteClicked"], function(buoyDailyData,siteClicked){return(
buoyDailyData.filter((d) => d.station === siteClicked)
)});
  main.variable(observer("sstaColors")).define("sstaColors", ["d3"], function(d3){return(
d3.scaleSequential(d3.interpolateRdBu).domain([4, -4])
)});
  main.variable(observer("coloursForSSTA")).define("coloursForSSTA", ["clickedSite","sstaColors"], function(clickedSite,sstaColors){return(
clickedSite.map((d) => sstaColors(d.ssta))
)});
  main.variable(observer()).define(["sstaColors"], function(sstaColors){return(
sstaColors(-2)
)});
  main.variable(observer()).define(["cmColors"], function(cmColors){return(
cmColors[255]
)});
  main.variable(observer("cmColors")).define("cmColors", ["cmBalance"], function(cmBalance)
{
  let outData = [];
  for (let i = 0; i < 256; i++) {
    outData.push(
      "rgb(" +
        Math.floor(cmBalance[0].red[i] * 256) +
        "," +
        Math.floor(cmBalance[0].green[i] * 256) +
        "," +
        Math.floor(cmBalance[0].blue[i] * 256) +
        ")"
    );
  }

  return outData;
}
);
  main.variable(observer()).define(["cmBalance"], function(cmBalance){return(
cmBalance[0].blue[1]
)});
  main.variable(observer("cmBalance")).define("cmBalance", function(){return(
[
  {
    red: [
      (0.0, 0.09317630180115785, 0.09317630180115785),
      (0.00392156862745098, 0.09697151501690242, 0.09697151501690242),
      (0.00784313725490196, 0.10096884516867825, 0.10096884516867825),
      (0.011764705882352941, 0.10499270138647665, 0.10499270138647665),
      (0.01568627450980392, 0.10898740202835612, 0.10898740202835612),
      (0.0196078431372549, 0.11292230081780658, 0.11292230081780658),
      (0.023529411764705882, 0.11677873726714609, 0.11677873726714609),
      (0.027450980392156862, 0.12054633687594118, 0.12054633687594118),
      (0.03137254901960784, 0.12421596532360021, 0.12421596532360021),
      (0.03529411764705882, 0.1277778433781234, 0.1277778433781234),
      (0.0392156862745098, 0.1312243830518975, 0.1312243830518975),
      (0.043137254901960784, 0.13454903857206513, 0.13454903857206513),
      (0.047058823529411764, 0.1377440294143188, 0.1377440294143188),
      (0.050980392156862744, 0.14079962508394736, 0.14079962508394736),
      (0.054901960784313725, 0.14370728407275138, 0.14370728407275138),
      (0.058823529411764705, 0.1464560785040432, 0.1464560785040432),
      (0.06274509803921569, 0.149034823940225, 0.149034823940225),
      (0.06666666666666667, 0.15143092582666298, 0.15143092582666298),
      (0.07058823529411765, 0.15362664681531915, 0.15362664681531915),
      (0.07450980392156863, 0.15560730446919063, 0.15560730446919063),
      (0.0784313725490196, 0.15735349418521424, 0.15735349418521424),
      (0.08235294117647059, 0.15884110777734892, 0.15884110777734892),
      (0.08627450980392157, 0.16003963106761285, 0.16003963106761285),
      (0.09019607843137255, 0.16092053212308569, 0.16092053212308569),
      (0.09411764705882353, 0.16144552665896417, 0.16144552665896417),
      (0.09803921568627451, 0.1615687582201553, 0.1615687582201553),
      (0.10196078431372549, 0.16123527693867226, 0.16123527693867226),
      (0.10588235294117647, 0.16037933695564538, 0.16037933695564538),
      (0.10980392156862745, 0.15891657032178305, 0.15891657032178305),
      (0.11372549019607843, 0.1567387388150081, 0.1567387388150081),
      (0.11764705882352941, 0.1537422741701029, 0.1537422741701029),
      (0.12156862745098039, 0.1497539850217275, 0.1497539850217275),
      (0.12549019607843137, 0.14461902801419324, 0.14461902801419324),
      (0.12941176470588234, 0.1381506719438431, 0.1381506719438431),
      (0.13333333333333333, 0.13019374811027845, 0.13019374811027845),
      (0.13725490196078433, 0.12070562948120826, 0.12070562948120826),
      (0.1411764705882353, 0.10982269384149349, 0.10982269384149349),
      (0.14509803921568626, 0.09795843445627249, 0.09795843445627249),
      (0.14901960784313725, 0.08570023827886969, 0.08570023827886969),
      (0.15294117647058825, 0.07367688675533522, 0.07367688675533522),
      (0.1568627450980392, 0.06252232597310112, 0.06252232597310112),
      (0.16078431372549018, 0.05283258403911514, 0.05283258403911514),
      (0.16470588235294117, 0.045209385399716286, 0.045209385399716286),
      (0.16862745098039217, 0.04023631323597558, 0.04023631323597558),
      (0.17254901960784313, 0.03831576485736641, 0.03831576485736641),
      (0.1764705882352941, 0.039483495280277246, 0.039483495280277246),
      (0.1803921568627451, 0.043458438883964015, 0.043458438883964015),
      (0.1843137254901961, 0.04962431895510653, 0.04962431895510653),
      (0.18823529411764706, 0.057398001170538865, 0.057398001170538865),
      (0.19215686274509802, 0.0662601753928873, 0.0662601753928873),
      (0.19607843137254902, 0.07582789138192139, 0.07582789138192139),
      (0.2, 0.08583710398799438, 0.08583710398799438),
      (0.20392156862745098, 0.09611023898027164, 0.09611023898027164),
      (0.20784313725490194, 0.10653038834605708, 0.10653038834605708),
      (0.21176470588235294, 0.11702164650203205, 0.11702164650203205),
      (0.21568627450980393, 0.12753579832032957, 0.12753579832032957),
      (0.2196078431372549, 0.1380432121650686, 0.1380432121650686),
      (0.22352941176470587, 0.1485266661140712, 0.1485266661140712),
      (0.22745098039215686, 0.15897743673285103, 0.15897743673285103),
      (0.23137254901960785, 0.16939270970702336, 0.16939270970702336),
      (0.23529411764705882, 0.17977385750188757, 0.17977385750188757),
      (0.2392156862745098, 0.19012528836535883, 0.19012528836535883),
      (0.24313725490196078, 0.20045367419916926, 0.20045367419916926),
      (0.24705882352941178, 0.21076743085458277, 0.21076743085458277),
      (0.25098039215686274, 0.221076366441748, 0.221076366441748),
      (0.2549019607843137, 0.23139143989901803, 0.23139143989901803),
      (0.2588235294117647, 0.241724588828799, 0.241724588828799),
      (0.2627450980392157, 0.25208859592177746, 0.25208859592177746),
      (0.26666666666666666, 0.26249696935827066, 0.26249696935827066),
      (0.27058823529411763, 0.27296381584466384, 0.27296381584466384),
      (0.27450980392156865, 0.2835036864649328, 0.2835036864649328),
      (0.2784313725490196, 0.29413137619056484, 0.29413137619056484),
      (0.2823529411764706, 0.3048616586033889, 0.3048616586033889),
      (0.28627450980392155, 0.31570893918919773, 0.31570893918919773),
      (0.2901960784313725, 0.3266868146870497, 0.3266868146870497),
      (0.29411764705882354, 0.3378075337747807, 0.3378075337747807),
      (0.2980392156862745, 0.3490818000871771, 0.3490818000871771),
      (0.30196078431372547, 0.36051697233349356, 0.36051697233349356),
      (0.3058823529411765, 0.3721163789840525, 0.3721163789840525),
      (0.30980392156862746, 0.38387987909022564, 0.38387987909022564),
      (0.3137254901960784, 0.3958028137607394, 0.3958028137607394),
      (0.3176470588235294, 0.4078755353103908, 0.4078755353103908),
      (0.32156862745098036, 0.42008255996043264, 0.42008255996043264),
      (0.3254901960784314, 0.43240665377828136, 0.43240665377828136),
      (0.32941176470588235, 0.4448270147115061, 0.4448270147115061),
      (0.3333333333333333, 0.4573210929073769, 0.4573210929073769),
      (0.33725490196078434, 0.4698658823662556, 0.4698658823662556),
      (0.3411764705882353, 0.482439163820049, 0.482439163820049),
      (0.34509803921568627, 0.4950205546820442, 0.4950205546820442),
      (0.34901960784313724, 0.5075922656244506, 0.5075922656244506),
      (0.3529411764705882, 0.5201395209800695, 0.5201395209800695),
      (0.3568627450980392, 0.5326506556783058, 0.5326506556783058),
      (0.3607843137254902, 0.5451151059190834, 0.5451151059190834),
      (0.36470588235294116, 0.5575181558550946, 0.5575181558550946),
      (0.3686274509803922, 0.5698635397781144, 0.5698635397781144),
      (0.37254901960784315, 0.5821485860154738, 0.5821485860154738),
      (0.3764705882352941, 0.59436023680205, 0.59436023680205),
      (0.3803921568627451, 0.6065080899095935, 0.6065080899095935),
      (0.38431372549019605, 0.6185864665812587, 0.6185864665812587),
      (0.38823529411764707, 0.6305963554035782, 0.6305963554035782),
      (0.39215686274509803, 0.6425403291413835, 0.6425403291413835),
      (0.396078431372549, 0.6544185977825304, 0.6544185977825304),
      (0.4, 0.6662315287143806, 0.6662315287143806),
      (0.403921568627451, 0.6779850393157121, 0.6779850393157121),
      (0.40784313725490196, 0.689675501321763, 0.689675501321763),
      (0.4117647058823529, 0.7013107513266423, 0.7013107513266423),
      (0.4156862745098039, 0.7128885314512862, 0.7128885314512862),
      (0.4196078431372549, 0.7244112448085553, 0.7244112448085553),
      (0.4235294117647059, 0.7358836989688381, 0.7358836989688381),
      (0.42745098039215684, 0.7473044386446878, 0.7473044386446878),
      (0.43137254901960786, 0.758675986008732, 0.758675986008732),
      (0.43529411764705883, 0.7700007022560962, 0.7700007022560962),
      (0.4392156862745098, 0.7812789490175477, 0.7812789490175477),
      (0.44313725490196076, 0.7925116214732782, 0.7925116214732782),
      (0.44705882352941173, 0.803699751035191, 0.803699751035191),
      (0.45098039215686275, 0.8148431081888104, 0.8148431081888104),
      (0.4549019607843137, 0.8259421593641688, 0.8259421593641688),
      (0.4588235294117647, 0.8369967539127279, 0.8369967539127279),
      (0.4627450980392157, 0.8480038340013846, 0.8480038340013846),
      (0.4666666666666667, 0.8589628398368314, 0.8589628398368314),
      (0.47058823529411764, 0.8698718779534677, 0.8698718779534677),
      (0.4745098039215686, 0.8807225950585578, 0.8807225950585578),
      (0.4784313725490196, 0.8915125639987499, 0.8915125639987499),
      (0.4823529411764706, 0.9022321856472953, 0.9022321856472953),
      (0.48627450980392156, 0.9128629530771474, 0.9128629530771474),
      (0.49019607843137253, 0.9233906674988954, 0.9233906674988954),
      (0.49411764705882355, 0.9337690699519378, 0.9337690699519378),
      (0.4980392156862745, 0.9438768578707728, 0.9438768578707728),
      (0.5019607843137255, 0.9450241336950317, 0.9450241336950317),
      (0.5058823529411764, 0.9401771503305338, 0.9401771503305338),
      (0.5098039215686274, 0.9357788176131994, 0.9357788176131994),
      (0.5137254901960784, 0.9316195516453254, 0.9316195516453254),
      (0.5176470588235293, 0.9276366903952598, 0.9276366903952598),
      (0.5215686274509804, 0.9237963723082157, 0.9237963723082157),
      (0.5254901960784314, 0.9200767818087644, 0.9200767818087644),
      (0.5294117647058824, 0.9164622665155583, 0.9164622665155583),
      (0.5333333333333333, 0.912940970001068, 0.912940970001068),
      (0.5372549019607843, 0.9095033897880691, 0.9095033897880691),
      (0.5411764705882353, 0.9061413505699446, 0.9061413505699446),
      (0.5450980392156862, 0.9028482401464246, 0.9028482401464246),
      (0.5490196078431373, 0.8996183458250351, 0.8996183458250351),
      (0.5529411764705883, 0.8964464017336835, 0.8964464017336835),
      (0.5568627450980392, 0.8933280984986638, 0.8933280984986638),
      (0.5607843137254902, 0.8902585423162623, 0.8902585423162623),
      (0.5647058823529412, 0.8872341531517662, 0.8872341531517662),
      (0.5686274509803921, 0.8842515223931736, 0.8842515223931736),
      (0.5725490196078431, 0.8813075692568397, 0.8813075692568397),
      (0.5764705882352941, 0.8783989821496545, 0.8783989821496545),
      (0.580392156862745, 0.8755220238171187, 0.8755220238171187),
      (0.5843137254901961, 0.8726749843514796, 0.8726749843514796),
      (0.5882352941176471, 0.8698547215416584, 0.8698547215416584),
      (0.592156862745098, 0.8670596624933959, 0.8670596624933959),
      (0.596078431372549, 0.8642855405275951, 0.8642855405275951),
      (0.6, 0.8615312235931758, 0.8615312235931758),
      (0.6039215686274509, 0.8587945613193221, 0.8587945613193221),
      (0.6078431372549019, 0.8560737697641846, 0.8560737697641846),
      (0.611764705882353, 0.8533647514077651, 0.8533647514077651),
      (0.615686274509804, 0.8506671813652187, 0.8506671813652187),
      (0.6196078431372549, 0.8479803760976425, 0.8479803760976425),
      (0.6235294117647059, 0.8452992890124731, 0.8452992890124731),
      (0.6274509803921569, 0.8426233261680482, 0.8426233261680482),
      (0.6313725490196078, 0.8399526706457653, 0.8399526706457653),
      (0.6352941176470588, 0.837282360615907, 0.837282360615907),
      (0.6392156862745098, 0.8346115013722665, 0.8346115013722665),
      (0.6431372549019607, 0.831941697133216, 0.831941697133216),
      (0.6470588235294118, 0.8292658393187906, 0.8292658393187906),
      (0.6509803921568628, 0.8265865191963319, 0.8265865191963319),
      (0.6549019607843137, 0.8239007716165898, 0.8239007716165898),
      (0.6588235294117647, 0.8212047236427109, 0.8212047236427109),
      (0.6627450980392157, 0.8185028441784485, 0.8185028441784485),
      (0.6666666666666666, 0.8157857974447502, 0.8157857974447502),
      (0.6705882352941176, 0.813059875502444, 0.813059875502444),
      (0.6745098039215687, 0.8103157295614865, 0.8103157295614865),
      (0.6784313725490196, 0.807560076306781, 0.807560076306781),
      (0.6823529411764706, 0.8047829983640773, 0.8047829983640773),
      (0.6862745098039216, 0.8019913643823088, 0.8019913643823088),
      (0.6901960784313725, 0.7991776069093209, 0.7991776069093209),
      (0.6941176470588235, 0.7963412506983238, 0.7963412506983238),
      (0.6980392156862745, 0.7934853391750593, 0.7934853391750593),
      (0.7019607843137254, 0.7906020861628313, 0.7906020861628313),
      (0.7058823529411764, 0.7876922078438238, 0.7876922078438238),
      (0.7098039215686275, 0.7847584433242354, 0.7847584433242354),
      (0.7137254901960784, 0.781794376348159, 0.781794376348159),
      (0.7176470588235294, 0.7787986023472407, 0.7787986023472407),
      (0.7215686274509804, 0.7757700306772616, 0.7757700306772616),
      (0.7254901960784313, 0.7727073763310283, 0.7727073763310283),
      (0.7294117647058823, 0.7696090956246998, 0.7696090956246998),
      (0.7333333333333333, 0.7664733140591652, 0.7664733140591652),
      (0.7372549019607844, 0.7632977462662783, 0.7632977462662783),
      (0.7411764705882353, 0.7600796083228246, 0.7600796083228246),
      (0.7450980392156863, 0.7568155232311499, 0.7568155232311499),
      (0.7490196078431373, 0.7535014210471865, 0.7535014210471865),
      (0.7529411764705882, 0.7501324359996864, 0.7501324359996864),
      (0.7568627450980392, 0.7467083678923865, 0.7467083678923865),
      (0.7607843137254902, 0.7432206214135255, 0.7432206214135255),
      (0.7647058823529411, 0.7396626352495903, 0.7396626352495903),
      (0.7686274509803921, 0.7360276592028782, 0.7360276592028782),
      (0.7725490196078432, 0.7323075054306246, 0.7323075054306246),
      (0.7764705882352941, 0.7284886793139783, 0.7284886793139783),
      (0.7803921568627451, 0.7245597795551689, 0.7245597795551689),
      (0.7843137254901961, 0.7205052554891408, 0.7205052554891408),
      (0.788235294117647, 0.7163077524522897, 0.7163077524522897),
      (0.792156862745098, 0.7119477511381475, 0.7119477511381475),
      (0.796078431372549, 0.7074046106878864, 0.7074046106878864),
      (0.8, 0.7026577763956233, 0.7026577763956233),
      (0.803921568627451, 0.6976856380676357, 0.6976856380676357),
      (0.807843137254902, 0.6924700993857928, 0.6924700993857928),
      (0.8117647058823529, 0.6869956304794752, 0.6869956304794752),
      (0.8156862745098039, 0.6812509389222788, 0.6812509389222788),
      (0.8196078431372549, 0.6752290404511712, 0.6752290404511712),
      (0.8235294117647058, 0.6689272347019628, 0.6689272347019628),
      (0.8274509803921568, 0.662346293032767, 0.662346293032767),
      (0.8313725490196078, 0.6554894621920682, 0.6554894621920682),
      (0.8352941176470589, 0.6483618361407727, 0.6483618361407727),
      (0.8392156862745098, 0.6409690900196459, 0.6409690900196459),
      (0.8431372549019608, 0.6333171868548846, 0.6333171868548846),
      (0.8470588235294118, 0.6254117682555889, 0.6254117682555889),
      (0.8509803921568627, 0.6172580943089347, 0.6172580943089347),
      (0.8549019607843137, 0.6088612137441752, 0.6088612137441752),
      (0.8588235294117647, 0.6002260075568476, 0.6002260075568476),
      (0.8627450980392157, 0.5913580665313181, 0.5913580665313181),
      (0.8666666666666667, 0.582264072459783, 0.582264072459783),
      (0.8705882352941177, 0.5729523242155735, 0.5729523242155735),
      (0.8745098039215686, 0.5634337248699358, 0.5634337248699358),
      (0.8784313725490196, 0.5537224099506779, 0.5537224099506779),
      (0.8823529411764706, 0.5438351395676242, 0.5438351395676242),
      (0.8862745098039215, 0.5337912133736735, 0.5337912133736735),
      (0.8901960784313725, 0.5236119994512118, 0.5236119994512118),
      (0.8941176470588235, 0.5133214710039554, 0.5133214710039554),
      (0.8980392156862745, 0.5029415119053962, 0.5029415119053962),
      (0.9019607843137255, 0.4924920560465744, 0.4924920560465744),
      (0.9058823529411765, 0.48199704198754206, 0.48199704198754206),
      (0.9098039215686274, 0.4714685312956432, 0.4714685312956432),
      (0.9137254901960784, 0.4609298385556734, 0.4609298385556734),
      (0.9176470588235294, 0.45038823069746997, 0.45038823069746997),
      (0.9215686274509803, 0.43985504456676383, 0.43985504456676383),
      (0.9254901960784314, 0.4293395854267749, 0.4293395854267749),
      (0.9294117647058824, 0.4188488052114383, 0.4188488052114383),
      (0.9333333333333333, 0.4083874753510262, 0.4083874753510262),
      (0.9372549019607843, 0.397958420697252, 0.397958420697252),
      (0.9411764705882353, 0.3875661805934747, 0.3875661805934747),
      (0.9450980392156862, 0.37721625624735117, 0.37721625624735117),
      (0.9490196078431372, 0.3669009710312429, 0.3669009710312429),
      (0.9529411764705882, 0.35662892011622993, 0.35662892011622993),
      (0.9568627450980391, 0.3463946141954396, 0.3463946141954396),
      (0.9607843137254902, 0.3362018241761821, 0.3362018241761821),
      (0.9647058823529412, 0.32604244022614925, 0.32604244022614925),
      (0.9686274509803922, 0.3159278573165507, 0.3159278573165507),
      (0.9725490196078431, 0.3058440467352614, 0.3058440467352614),
      (0.9764705882352941, 0.2957906289005874, 0.2957906289005874),
      (0.9803921568627451, 0.2857761694878987, 0.2857761694878987),
      (0.984313725490196, 0.2757883929056377, 0.2757883929056377),
      (0.9882352941176471, 0.2658251433737037, 0.2658251433737037),
      (0.9921568627450981, 0.2558840557281191, 0.2558840557281191),
      (0.996078431372549, 0.24596222207835025, 0.24596222207835025),
      (1.0, 0.23605636466461405, 0.23605636466461405)
    ],
    green: [
      (0.0, 0.11117332947760272, 0.11117332947760272),
      (0.00392156862745098, 0.11687021097928418, 0.11687021097928418),
      (0.00784313725490196, 0.1223931506799195, 0.1223931506799195),
      (0.011764705882352941, 0.1278243708004132, 0.1278243708004132),
      (0.01568627450980392, 0.13319350382565795, 0.13319350382565795),
      (0.0196078431372549, 0.13851314494597344, 0.13851314494597344),
      (0.023529411764705882, 0.1437907235567954, 0.1437907235567954),
      (0.027450980392156862, 0.14903304989914884, 0.14903304989914884),
      (0.03137254901960784, 0.15424489609911743, 0.15424489609911743),
      (0.03529411764705882, 0.15942929976504253, 0.15942929976504253),
      (0.0392156862745098, 0.16458992746550083, 0.16458992746550083),
      (0.043137254901960784, 0.16973077842448914, 0.16973077842448914),
      (0.047058823529411764, 0.17485524890812715, 0.17485524890812715),
      (0.050980392156862744, 0.1799660943911219, 0.1799660943911219),
      (0.054901960784313725, 0.1850671827584921, 0.1850671827584921),
      (0.058823529411764705, 0.19016192641870314, 0.19016192641870314),
      (0.06274509803921569, 0.19525447862886824, 0.19525447862886824),
      (0.06666666666666667, 0.20034937458089813, 0.20034937458089813),
      (0.07058823529411765, 0.20545037829694926, 0.20545037829694926),
      (0.07450980392156863, 0.21056389891883448, 0.21056389891883448),
      (0.0784313725490196, 0.21569621295603672, 0.21569621295603672),
      (0.08235294117647059, 0.22085406309837297, 0.22085406309837297),
      (0.08627450980392157, 0.22604480544888214, 0.22604480544888214),
      (0.09019607843137255, 0.2312792188936387, 0.2312792188936387),
      (0.09411764705882353, 0.23656875726570425, 0.23656875726570425),
      (0.09803921568627451, 0.24192717317982598, 0.24192717317982598),
      (0.10196078431372549, 0.24737118676323502, 0.24737118676323502),
      (0.10588235294117647, 0.2529213001868847, 0.2529213001868847),
      (0.10980392156862745, 0.2586022090180683, 0.2586022090180683),
      (0.11372549019607843, 0.2644444177118183, 0.2644444177118183),
      (0.11764705882352941, 0.2704875236386606, 0.2704875236386606),
      (0.12156862745098039, 0.27677729068691403, 0.27677729068691403),
      (0.12549019607843137, 0.28337033710990084, 0.28337033710990084),
      (0.12941176470588234, 0.29032902660809945, 0.29032902660809945),
      (0.13333333333333333, 0.29771374755822616, 0.29771374755822616),
      (0.13725490196078433, 0.3055623316038361, 0.3055623316038361),
      (0.1411764705882353, 0.31386518829791077, 0.31386518829791077),
      (0.14509803921568626, 0.32254310245858836, 0.32254310245858836),
      (0.14901960784313725, 0.33146616127518264, 0.33146616127518264),
      (0.15294117647058825, 0.3404967458048911, 0.3404967458048911),
      (0.1568627450980392, 0.3495197377754474, 0.3495197377754474),
      (0.16078431372549018, 0.35846007812371655, 0.35846007812371655),
      (0.16470588235294117, 0.3672749347230809, 0.3672749347230809),
      (0.16862745098039217, 0.3759418522020857, 0.3759418522020857),
      (0.17254901960784313, 0.3844536826035842, 0.3844536826035842),
      (0.1764705882352941, 0.39281375366701304, 0.39281375366701304),
      (0.1803921568627451, 0.40102370971704254, 0.40102370971704254),
      (0.1843137254901961, 0.4090953160508888, 0.4090953160508888),
      (0.18823529411764706, 0.41703469541680477, 0.41703469541680477),
      (0.19215686274509802, 0.4248521500099918, 0.4248521500099918),
      (0.19607843137254902, 0.43255722492309484, 0.43255722492309484),
      (0.2, 0.44015834330399145, 0.44015834330399145),
      (0.20392156862745098, 0.44766357455714456, 0.44766357455714456),
      (0.20784313725490194, 0.4550804241299538, 0.4550804241299538),
      (0.21176470588235294, 0.46241591119241177, 0.46241591119241177),
      (0.21568627450980393, 0.46967671977318937, 0.46967671977318937),
      (0.2196078431372549, 0.47686867948587963, 0.47686867948587963),
      (0.22352941176470587, 0.48399707474877746, 0.48399707474877746),
      (0.22745098039215686, 0.4910666599003393, 0.4910666599003393),
      (0.23137254901960785, 0.49808167670078485, 0.49808167670078485),
      (0.23529411764705882, 0.5050458714090991, 0.5050458714090991),
      (0.2392156862745098, 0.5119625097219066, 0.5119625097219066),
      (0.24313725490196078, 0.5188343886055642, 0.5188343886055642),
      (0.24705882352941178, 0.5256638445778924, 0.5256638445778924),
      (0.25098039215686274, 0.5324527583974503, 0.5324527583974503),
      (0.2549019607843137, 0.5392025564688637, 0.5392025564688637),
      (0.2588235294117647, 0.545914209630201, 0.545914209630201),
      (0.2627450980392157, 0.5525882304010225, 0.5525882304010225),
      (0.26666666666666666, 0.5592246702775623, 0.5592246702775623),
      (0.27058823529411763, 0.5658231192947546, 0.5658231192947546),
      (0.27450980392156865, 0.572382710845828, 0.572382710845828),
      (0.2784313725490196, 0.5789021356407471, 0.5789021356407471),
      (0.2823529411764706, 0.5853796696249742, 0.5853796696249742),
      (0.28627450980392155, 0.5918132215225328, 0.5918132215225328),
      (0.2901960784313725, 0.5982004061606387, 0.5982004061606387),
      (0.29411764705882354, 0.6045386495071959, 0.6045386495071959),
      (0.2980392156862745, 0.6108253115449156, 0.6108253115449156),
      (0.30196078431372547, 0.6170578982409773, 0.6170578982409773),
      (0.3058823529411765, 0.6232343167456089, 0.6232343167456089),
      (0.30980392156862746, 0.6293530561660979, 0.6293530561660979),
      (0.3137254901960784, 0.6354134382185919, 0.6354134382185919),
      (0.3176470588235294, 0.641415857529097, 0.641415857529097),
      (0.32156862745098036, 0.6473620651543986, 0.6473620651543986),
      (0.3254901960784314, 0.653254850478041, 0.653254850478041),
      (0.32941176470588235, 0.6590982595876609, 0.6590982595876609),
      (0.3333333333333333, 0.6648973878622412, 0.6648973878622412),
      (0.33725490196078434, 0.6706581495075844, 0.6706581495075844),
      (0.3411764705882353, 0.6763869948243976, 0.6763869948243976),
      (0.34509803921568627, 0.682090613291995, 0.682090613291995),
      (0.34901960784313724, 0.6877756591216436, 0.6877756591216436),
      (0.3529411764705882, 0.6934485275105085, 0.6934485275105085),
      (0.3568627450980392, 0.6991151975856019, 0.6991151975856019),
      (0.3607843137254902, 0.7047815278674717, 0.7047815278674717),
      (0.36470588235294116, 0.7104543187762521, 0.7104543187762521),
      (0.3686274509803922, 0.716136513619915, 0.716136513619915),
      (0.37254901960784315, 0.7218322109491161, 0.7218322109491161),
      (0.3764705882352941, 0.7275477994362923, 0.7275477994362923),
      (0.3803921568627451, 0.733284447972654, 0.733284447972654),
      (0.38431372549019605, 0.7390466790641197, 0.7390466790641197),
      (0.38823529411764707, 0.7448373397672364, 0.7448373397672364),
      (0.39215686274509803, 0.750658768533136, 0.750658768533136),
      (0.396078431372549, 0.7565137308188259, 0.7565137308188259),
      (0.4, 0.7624048800378465, 0.7624048800378465),
      (0.403921568627451, 0.7683332855369555, 0.7683332855369555),
      (0.40784313725490196, 0.7743024253591546, 0.7743024253591546),
      (0.4117647058823529, 0.7803126348729137, 0.7803126348729137),
      (0.4156862745098039, 0.7863668558670167, 0.7863668558670167),
      (0.4196078431372549, 0.7924667152464016, 0.7924667152464016),
      (0.4235294117647059, 0.7986130654557249, 0.7986130654557249),
      (0.42745098039215684, 0.8048084510111998, 0.8048084510111998),
      (0.43137254901960786, 0.8110542493572185, 0.8110542493572185),
      (0.43529411764705883, 0.8173518180665149, 0.8173518180665149),
      (0.4392156862745098, 0.8237030526155881, 0.8237030526155881),
      (0.44313725490196076, 0.8301096652946458, 0.8301096652946458),
      (0.44705882352941173, 0.8365733017623518, 0.8365733017623518),
      (0.45098039215686275, 0.8430959697406819, 0.8430959697406819),
      (0.4549019607843137, 0.849679464615625, 0.849679464615625),
      (0.4588235294117647, 0.8563257710703113, 0.8563257710703113),
      (0.4627450980392157, 0.8630377874332209, 0.8630377874332209),
      (0.4666666666666667, 0.8698176873531217, 0.8698176873531217),
      (0.47058823529411764, 0.8766681056859057, 0.8766681056859057),
      (0.4745098039215686, 0.8835937613774932, 0.8835937613774932),
      (0.4784313725490196, 0.8905976582376063, 0.8905976582376063),
      (0.4823529411764706, 0.897685181917325, 0.897685181917325),
      (0.48627450980392156, 0.9048646775143293, 0.9048646775143293),
      (0.49019607843137253, 0.9121434538185491, 0.9121434538185491),
      (0.49411764705882355, 0.9195389121458988, 0.9195389121458988),
      (0.4980392156862745, 0.9270905817099515, 0.9270905817099515),
      (0.5019607843137255, 0.9267273985243988, 0.9267273985243988),
      (0.5058823529411764, 0.9175010969420787, 0.9175010969420787),
      (0.5098039215686274, 0.908184960297723, 0.908184960297723),
      (0.5137254901960784, 0.8988455936080793, 0.8988455936080793),
      (0.5176470588235293, 0.8895015346080178, 0.8895015346080178),
      (0.5215686274509804, 0.8801619939913721, 0.8801619939913721),
      (0.5254901960784314, 0.87083231155658, 0.87083231155658),
      (0.5294117647058824, 0.8615158650696723, 0.8615158650696723),
      (0.5333333333333333, 0.852214830207059, 0.852214830207059),
      (0.5372549019607843, 0.842930646131394, 0.842930646131394),
      (0.5411764705882353, 0.8336643536120031, 0.8336643536120031),
      (0.5450980392156862, 0.8244164969479622, 0.8244164969479622),
      (0.5490196078431373, 0.8151873435674267, 0.8151873435674267),
      (0.5529411764705883, 0.805977037140355, 0.805977037140355),
      (0.5568627450980392, 0.796785406266844, 0.796785406266844),
      (0.5607843137254902, 0.7876125240246927, 0.7876125240246927),
      (0.5647058823529412, 0.77845800661117, 0.77845800661117),
      (0.5686274509803921, 0.769321423964533, 0.769321423964533),
      (0.5725490196078431, 0.7602022354826804, 0.7602022354826804),
      (0.5764705882352941, 0.7511000050313839, 0.7511000050313839),
      (0.580392156862745, 0.7420144833045194, 0.7420144833045194),
      (0.5843137254901961, 0.7329446408023256, 0.7329446408023256),
      (0.5882352941176471, 0.723890013017027, 0.723890013017027),
      (0.592156862745098, 0.7148495108503408, 0.7148495108503408),
      (0.596078431372549, 0.7058231520382152, 0.7058231520382152),
      (0.6, 0.6968096810882964, 0.6968096810882964),
      (0.6039215686274509, 0.6878082471826545, 0.6878082471826545),
      (0.6078431372549019, 0.6788178389092563, 0.6788178389092563),
      (0.611764705882353, 0.6698384520573988, 0.6698384520573988),
      (0.615686274509804, 0.6608684511065676, 0.6608684511065676),
      (0.6196078431372549, 0.6519062997089123, 0.6519062997089123),
      (0.6235294117647059, 0.6429524288345008, 0.6429524288345008),
      (0.6274509803921569, 0.6340052727647744, 0.6340052727647744),
      (0.6313725490196078, 0.6250628349958034, 0.6250628349958034),
      (0.6352941176470588, 0.6161255232979982, 0.6161255232979982),
      (0.6392156862745098, 0.6071918418882036, 0.6071918418882036),
      (0.6431372549019607, 0.5982589838531851, 0.5982589838531851),
      (0.6470588235294118, 0.5893284247613858, 0.5893284247613858),
      (0.6509803921568628, 0.5803968068112989, 0.5803968068112989),
      (0.6549019607843137, 0.5714634777707677, 0.5714634777707677),
      (0.6588235294117647, 0.5625283035002011, 0.5625283035002011),
      (0.6627450980392157, 0.5535866371885466, 0.5535866371885466),
      (0.6666666666666666, 0.5446412013022013, 0.5446412013022013),
      (0.6705882352941176, 0.535686153086953, 0.535686153086953),
      (0.6745098039215687, 0.5267242547499885, 0.5267242547499885),
      (0.6784313725490196, 0.5177491168092127, 0.5177491168092127),
      (0.6823529411764706, 0.5087638530967844, 0.5087638530967844),
      (0.6862745098039216, 0.49976162654698647, 0.49976162654698647),
      (0.6901960784313725, 0.49074410985075384, 0.49074410985075384),
      (0.6941176470588235, 0.4817086347924899, 0.4817086347924899),
      (0.6980392156862745, 0.4726500967551418, 0.4726500967551418),
      (0.7019607843137254, 0.463570184371689, 0.463570184371689),
      (0.7058823529411764, 0.4544650164439674, 0.4544650164439674),
      (0.7098039215686275, 0.4453290095612297, 0.4453290095612297),
      (0.7137254901960784, 0.4361626378195018, 0.4361626378195018),
      (0.7176470588235294, 0.4269628178617235, 0.4269628178617235),
      (0.7215686274509804, 0.4177259860608659, 0.4177259860608659),
      (0.7254901960784313, 0.40844842276677457, 0.40844842276677457),
      (0.7294117647058823, 0.39912628016260343, 0.39912628016260343),
      (0.7333333333333333, 0.38975562059023594, 0.38975562059023594),
      (0.7372549019607844, 0.3803324674237734, 0.3803324674237734),
      (0.7411764705882353, 0.3708528707479538, 0.3708528707479538),
      (0.7450980392156863, 0.3613129902046506, 0.3613129902046506),
      (0.7490196078431373, 0.3517091973617619, 0.3517091973617619),
      (0.7529411764705882, 0.34203819978054445, 0.34203819978054445),
      (0.7568627450980392, 0.3322917332197801, 0.3322917332197801),
      (0.7607843137254902, 0.32246895137228654, 0.32246895137228654),
      (0.7647058823529411, 0.312566717636688, 0.312566717636688),
      (0.7686274509803921, 0.3025817058357924, 0.3025817058357924),
      (0.7725490196078432, 0.29251159261250903, 0.29251159261250903),
      (0.7764705882352941, 0.28235996223936183, 0.28235996223936183),
      (0.7803921568627451, 0.27212835075246056, 0.27212835075246056),
      (0.7843137254901961, 0.26182376999357504, 0.26182376999357504),
      (0.788235294117647, 0.25145684700795434, 0.25145684700795434),
      (0.792156862745098, 0.24104316715230473, 0.24104316715230473),
      (0.796078431372549, 0.23060295769037464, 0.23060295769037464),
      (0.8, 0.22016032476969405, 0.22016032476969405),
      (0.803921568627451, 0.20974624589830168, 0.20974624589830168),
      (0.807843137254902, 0.19939234809690337, 0.19939234809690337),
      (0.8117647058823529, 0.18913262176416293, 0.18913262176416293),
      (0.8156862745098039, 0.1790005719286616, 0.1790005719286616),
      (0.8196078431372549, 0.16902839517353063, 0.16902839517353063),
      (0.8235294117647058, 0.15924601138533828, 0.15924601138533828),
      (0.8274509803921568, 0.14968149923234314, 0.14968149923234314),
      (0.8313725490196078, 0.14036225902197907, 0.14036225902197907),
      (0.8352941176470589, 0.13131544910443987, 0.13131544910443987),
      (0.8392156862745098, 0.12257089949159498, 0.12257089949159498),
      (0.8431372549019608, 0.11416163812993223, 0.11416163812993223),
      (0.8470588235294118, 0.10612632074054544, 0.10612632074054544),
      (0.8509803921568627, 0.09850955940169046, 0.09850955940169046),
      (0.8549019607843137, 0.09136271116346881, 0.09136271116346881),
      (0.8588235294117647, 0.0847426884560575, 0.0847426884560575),
      (0.8627450980392157, 0.07870937974751123, 0.07870937974751123),
      (0.8666666666666667, 0.07332110668924821, 0.07332110668924821),
      (0.8705882352941177, 0.0686287018258751, 0.0686287018258751),
      (0.8745098039215686, 0.06466696013382159, 0.06466696013382159),
      (0.8784313725490196, 0.06144626935987179, 0.06144626935987179),
      (0.8823529411764706, 0.05894914800814858, 0.05894914800814858),
      (0.8862745098039215, 0.057128581028818445, 0.057128581028818445),
      (0.8901960784313725, 0.0559109512937423, 0.0559109512937423),
      (0.8941176470588235, 0.05519900277454217, 0.05519900277454217),
      (0.8980392156862745, 0.05489268743951671, 0.05489268743951671),
      (0.9019607843137255, 0.05489497800522934, 0.05489497800522934),
      (0.9058823529411765, 0.05509874164212421, 0.05509874164212421),
      (0.9098039215686274, 0.055437529587861384, 0.055437529587861384),
      (0.9137254901960784, 0.05581817450175155, 0.05581817450175155),
      (0.9176470588235294, 0.05620093240974463, 0.05620093240974463),
      (0.9215686274509803, 0.05653967482715422, 0.05653967482715422),
      (0.9254901960784314, 0.056798929055138545, 0.056798929055138545),
      (0.9294117647058824, 0.056953512757200814, 0.056953512757200814),
      (0.9333333333333333, 0.056986797359617467, 0.056986797359617467),
      (0.9372549019607843, 0.05688899115379055, 0.05688899115379055),
      (0.9411764705882353, 0.05664744510513378, 0.05664744510513378),
      (0.9450980392156862, 0.05624858727791105, 0.05624858727791105),
      (0.9490196078431372, 0.055710275774513256, 0.055710275774513256),
      (0.9529411764705882, 0.05501236188184371, 0.05501236188184371),
      (0.9568627450980391, 0.054167130511578995, 0.054167130511578995),
      (0.9607843137254902, 0.053165772930087264, 0.053165772930087264),
      (0.9647058823529412, 0.05202497987647034, 0.05202497987647034),
      (0.9686274509803922, 0.05071934147936142, 0.05071934147936142),
      (0.9725490196078431, 0.04927677960771513, 0.04927677960771513),
      (0.9764705882352941, 0.04769542811326496, 0.04769542811326496),
      (0.9803921568627451, 0.045955169033100075, 0.045955169033100075),
      (0.984313725490196, 0.04407729543414405, 0.04407729543414405),
      (0.9882352941176471, 0.042061612749658014, 0.042061612749658014),
      (0.9921568627450981, 0.03990046570244704, 0.03990046570244704),
      (0.996078431372549, 0.03762595141506584, 0.03762595141506584),
      (1.0, 0.03529747994604029, 0.03529747994604029)
    ],
    blue: [
      (0.0, 0.26151238855305475, 0.26151238855305475),
      (0.00392156862745098, 0.2730963071061036, 0.2730963071061036),
      (0.00784313725490196, 0.2849103610759459, 0.2849103610759459),
      (0.011764705882352941, 0.2968738052891421, 0.2968738052891421),
      (0.01568627450980392, 0.3089538370897204, 0.3089538370897204),
      (0.0196078431372549, 0.3211528356563003, 0.3211528356563003),
      (0.023529411764705882, 0.3334763137669405, 0.3334763137669405),
      (0.027450980392156862, 0.34591927128228656, 0.34591927128228656),
      (0.03137254901960784, 0.3584824902114074, 0.3584824902114074),
      (0.03529411764705882, 0.371173718290745, 0.371173718290745),
      (0.0392156862745098, 0.3839938980982077, 0.3839938980982077),
      (0.043137254901960784, 0.39694024984651316, 0.39694024984651316),
      (0.047058823529411764, 0.4100132193954067, 0.4100132193954067),
      (0.050980392156862744, 0.4232173781877684, 0.4232173781877684),
      (0.054901960784313725, 0.4365502201613833, 0.4365502201613833),
      (0.058823529411764705, 0.4500130967746719, 0.4500130967746719),
      (0.06274509803921569, 0.4636036238706138, 0.4636036238706138),
      (0.06666666666666667, 0.4773185296806869, 0.4773185296806869),
      (0.07058823529411765, 0.4911623505831314, 0.4911623505831314),
      (0.07450980392156863, 0.5051241984185816, 0.5051241984185816),
      (0.0784313725490196, 0.5191977165014443, 0.5191977165014443),
      (0.08235294117647059, 0.5333780986311172, 0.5333780986311172),
      (0.08627450980392157, 0.5476626851250719, 0.5476626851250719),
      (0.09019607843137255, 0.5620307968352062, 0.5620307968352062),
      (0.09411764705882353, 0.576466194856672, 0.576466194856672),
      (0.09803921568627451, 0.590947280971239, 0.590947280971239),
      (0.10196078431372549, 0.6054446786315182, 0.6054446786315182),
      (0.10588235294117647, 0.619917940349733, 0.619917940349733),
      (0.10980392156862745, 0.6343183928801526, 0.6343183928801526),
      (0.11372549019607843, 0.6485832602021305, 0.6485832602021305),
      (0.11764705882352941, 0.6625942914402649, 0.6625942914402649),
      (0.12156862745098039, 0.6762428866538949, 0.6762428866538949),
      (0.12549019607843137, 0.689330315540539, 0.689330315540539),
      (0.12941176470588234, 0.7016166706228141, 0.7016166706228141),
      (0.13333333333333333, 0.7127928058673725, 0.7127928058673725),
      (0.13725490196078433, 0.7225101391519437, 0.7225101391519437),
      (0.1411764705882353, 0.7304694442052537, 0.7304694442052537),
      (0.14509803921568626, 0.7365271649499161, 0.7365271649499161),
      (0.14901960784313725, 0.7407718073497576, 0.7407718073497576),
      (0.15294117647058825, 0.7434693436710166, 0.7434693436710166),
      (0.1568627450980392, 0.7449562973790244, 0.7449562973790244),
      (0.16078431372549018, 0.745545184770378, 0.745545184770378),
      (0.16470588235294117, 0.7454889092261349, 0.7454889092261349),
      (0.16862745098039217, 0.7449841371058433, 0.7449841371058433),
      (0.17254901960784313, 0.7441746283479094, 0.7441746283479094),
      (0.1764705882352941, 0.7431581338661337, 0.7431581338661337),
      (0.1803921568627451, 0.7420243047032399, 0.7420243047032399),
      (0.1843137254901961, 0.7408166831290733, 0.7408166831290733),
      (0.18823529411764706, 0.739587753987574, 0.739587753987574),
      (0.19215686274509802, 0.738365012211145, 0.738365012211145),
      (0.19607843137254902, 0.7371697936237425, 0.7371697936237425),
      (0.2, 0.7360206802189788, 0.7360206802189788),
      (0.20392156862745098, 0.7349312516211791, 0.7349312516211791),
      (0.20784313725490194, 0.7339117735870001, 0.7339117735870001),
      (0.21176470588235294, 0.7329693696980988, 0.7329693696980988),
      (0.21568627450980393, 0.7321074968220892, 0.7321074968220892),
      (0.2196078431372549, 0.7313295149248255, 0.7313295149248255),
      (0.22352941176470587, 0.7306374469250059, 0.7306374469250059),
      (0.22745098039215686, 0.7300322634722053, 0.7300322634722053),
      (0.23137254901960785, 0.729514099015609, 0.729514099015609),
      (0.23529411764705882, 0.7290824177866463, 0.7290824177866463),
      (0.2392156862745098, 0.7287361439246872, 0.7287361439246872),
      (0.24313725490196078, 0.7284737667569484, 0.7284737667569484),
      (0.24705882352941178, 0.7282934299212739, 0.7282934299212739),
      (0.25098039215686274, 0.7281930113726283, 0.7281930113726283),
      (0.2549019607843137, 0.7281702001646749, 0.7281702001646749),
      (0.2588235294117647, 0.7282225751002736, 0.7282225751002736),
      (0.2627450980392157, 0.7283476897674903, 0.7283476897674903),
      (0.26666666666666666, 0.7285431679898072, 0.7285431679898072),
      (0.27058823529411763, 0.7288068131774058, 0.7288068131774058),
      (0.27450980392156865, 0.7291367343046032, 0.7291367343046032),
      (0.2784313725490196, 0.7295314900628433, 0.7295314900628433),
      (0.2823529411764706, 0.7299902509334001, 0.7299902509334001),
      (0.28627450980392155, 0.7305129762764809, 0.7305129762764809),
      (0.2901960784313725, 0.7311005998876301, 0.7311005998876301),
      (0.29411764705882354, 0.7317552128195413, 0.7317552128195413),
      (0.2980392156862745, 0.7324796800093838, 0.7324796800093838),
      (0.30196078431372547, 0.7332792190500568, 0.7332792190500568),
      (0.3058823529411765, 0.7341612307067191, 0.7341612307067191),
      (0.30980392156862746, 0.7351337469132934, 0.7351337469132934),
      (0.3137254901960784, 0.7362060213183361, 0.7362060213183361),
      (0.3176470588235294, 0.7373884640869047, 0.7373884640869047),
      (0.32156862745098036, 0.7386930839012651, 0.7386930839012651),
      (0.3254901960784314, 0.7401294470548486, 0.7401294470548486),
      (0.32941176470588235, 0.7417069328868316, 0.7417069328868316),
      (0.3333333333333333, 0.7434335263117878, 0.7434335263117878),
      (0.33725490196078434, 0.7453153847182404, 0.7453153847182404),
      (0.3411764705882353, 0.7473565606883062, 0.7473565606883062),
      (0.34509803921568627, 0.7495589040396917, 0.7495589040396917),
      (0.34901960784313724, 0.7519221394187724, 0.7519221394187724),
      (0.3529411764705882, 0.7544440922042097, 0.7544440922042097),
      (0.3568627450980392, 0.7571210204550441, 0.7571210204550441),
      (0.3607843137254902, 0.7599492971931862, 0.7599492971931862),
      (0.36470588235294116, 0.7629291415211208, 0.7629291415211208),
      (0.3686274509803922, 0.7660488334775966, 0.7660488334775966),
      (0.37254901960784315, 0.769302356785558, 0.769302356785558),
      (0.3764705882352941, 0.7726916325476315, 0.7726916325476315),
      (0.3803921568627451, 0.776204111481631, 0.776204111481631),
      (0.38431372549019605, 0.7798383670352863, 0.7798383670352863),
      (0.38823529411764707, 0.7835892177406345, 0.7835892177406345),
      (0.39215686274509803, 0.7874510644025978, 0.7874510644025978),
      (0.396078431372549, 0.7914204294842384, 0.7914204294842384),
      (0.4, 0.7954941819359623, 0.7954941819359623),
      (0.403921568627451, 0.7996659972294575, 0.7996659972294575),
      (0.40784313725490196, 0.8039360994237752, 0.8039360994237752),
      (0.4117647058823529, 0.8082975524678305, 0.8082975524678305),
      (0.4156862745098039, 0.8127502175082055, 0.8127502175082055),
      (0.4196078431372549, 0.8172911293271548, 0.8172911293271548),
      (0.4235294117647059, 0.821915897164489, 0.821915897164489),
      (0.42745098039215684, 0.8266243361574354, 0.8266243361574354),
      (0.43137254901960786, 0.8314137476978961, 0.8314137476978961),
      (0.43529411764705883, 0.8362815657919247, 0.8362815657919247),
      (0.4392156862745098, 0.8412265533654797, 0.8412265533654797),
      (0.44313725490196076, 0.846247095671401, 0.846247095671401),
      (0.44705882352941173, 0.8513414099007207, 0.8513414099007207),
      (0.45098039215686275, 0.8565084542610862, 0.8565084542610862),
      (0.4549019607843137, 0.8617465433522451, 0.8617465433522451),
      (0.4588235294117647, 0.8670541605111353, 0.8670541605111353),
      (0.4627450980392157, 0.8724315628924932, 0.8724315628924932),
      (0.4666666666666667, 0.877876840786735, 0.877876840786735),
      (0.47058823529411764, 0.8833884311630416, 0.8833884311630416),
      (0.4745098039215686, 0.8889689808541468, 0.8889689808541468),
      (0.4784313725490196, 0.89461579325232, 0.89461579325232),
      (0.4823529411764706, 0.9003303399902122, 0.9003303399902122),
      (0.48627450980392156, 0.9061201920398329, 0.9061201920398329),
      (0.49019607843137253, 0.9119872701021833, 0.9119872701021833),
      (0.49411764705882355, 0.9179604265763981, 0.9179604265763981),
      (0.4980392156862745, 0.9241478407896099, 0.9241478407896099),
      (0.5019607843137255, 0.9232017297254779, 0.9232017297254779),
      (0.5058823529411764, 0.9127353023021862, 0.9127353023021862),
      (0.5098039215686274, 0.901995897050405, 0.901995897050405),
      (0.5137254901960784, 0.8911247259869568, 0.8911247259869568),
      (0.5176470588235293, 0.8801625091446738, 0.8801625091446738),
      (0.5215686274509804, 0.8691306632065186, 0.8691306632065186),
      (0.5254901960784314, 0.8580426479951917, 0.8580426479951917),
      (0.5294117647058824, 0.8469079246742293, 0.8469079246742293),
      (0.5333333333333333, 0.8357335125969564, 0.8357335125969564),
      (0.5372549019607843, 0.8245249535921665, 0.8245249535921665),
      (0.5411764705882353, 0.8132870275157045, 0.8132870275157045),
      (0.5450980392156862, 0.802023499294289, 0.802023499294289),
      (0.5490196078431373, 0.7907375926293952, 0.7907375926293952),
      (0.5529411764705883, 0.7794323253122594, 0.7794323253122594),
      (0.5568627450980392, 0.7681100636805964, 0.7681100636805964),
      (0.5607843137254902, 0.756773797154693, 0.756773797154693),
      (0.5647058823529412, 0.7454255275413548, 0.7454255275413548),
      (0.5686274509803921, 0.7340672060990319, 0.7340672060990319),
      (0.5725490196078431, 0.7227005864751235, 0.7227005864751235),
      (0.5764705882352941, 0.7113277185683903, 0.7113277185683903),
      (0.580392156862745, 0.6999511354610528, 0.6999511354610528),
      (0.5843137254901961, 0.688571641186953, 0.688571641186953),
      (0.5882352941176471, 0.6771913952144654, 0.6771913952144654),
      (0.592156862745098, 0.665811198810034, 0.665811198810034),
      (0.596078431372549, 0.6544344321908397, 0.6544344321908397),
      (0.6, 0.643061652171077, 0.643061652171077),
      (0.6039215686274509, 0.6316944172411574, 0.6316944172411574),
      (0.6078431372549019, 0.620334009627433, 0.620334009627433),
      (0.611764705882353, 0.6089840337795547, 0.6089840337795547),
      (0.615686274509804, 0.597644543026785, 0.597644543026785),
      (0.6196078431372549, 0.5863159553827916, 0.5863159553827916),
      (0.6235294117647059, 0.575003093103067, 0.575003093103067),
      (0.6274509803921569, 0.5637064935396089, 0.5637064935396089),
      (0.6313725490196078, 0.5524259435430849, 0.5524259435430849),
      (0.6352941176470588, 0.5411665126797099, 0.5411665126797099),
      (0.6392156862745098, 0.5299292934604437, 0.5299292934604437),
      (0.6431372549019607, 0.5187128588454869, 0.5187128588454869),
      (0.6470588235294118, 0.5075248627530007, 0.5075248627530007),
      (0.6509803921568628, 0.49636307911450966, 0.49636307911450966),
      (0.6549019607843137, 0.4852311209906218, 0.4852311209906218),
      (0.6588235294117647, 0.47413373671726455, 0.47413373671726455),
      (0.6627450980392157, 0.46306699747606006, 0.46306699747606006),
      (0.6666666666666666, 0.4520417208585163, 0.4520417208585163),
      (0.6705882352941176, 0.44105231092425845, 0.44105231092425845),
      (0.6745098039215687, 0.4301100025814295, 0.4301100025814295),
      (0.6784313725490196, 0.41920905177281625, 0.41920905177281625),
      (0.6823529411764706, 0.4083617627821872, 0.4083617627821872),
      (0.6862745098039216, 0.3975626288212919, 0.3975626288212919),
      (0.6901960784313725, 0.38682195104276124, 0.38682195104276124),
      (0.6941176470588235, 0.37614267993473127, 0.37614267993473127),
      (0.6980392156862745, 0.3655242898980975, 0.3655242898980975),
      (0.7019607843137254, 0.35497831597860807, 0.35497831597860807),
      (0.7058823529411764, 0.3445075235304189, 0.3445075235304189),
      (0.7098039215686275, 0.3341130019968927, 0.3341130019968927),
      (0.7137254901960784, 0.32380621185053277, 0.32380621185053277),
      (0.7176470588235294, 0.313593824377752, 0.313593824377752),
      (0.7215686274509804, 0.3034828822113839, 0.3034828822113839),
      (0.7254901960784313, 0.29348145476143467, 0.29348145476143467),
      (0.7294117647058823, 0.2835988305456279, 0.2835988305456279),
      (0.7333333333333333, 0.27384573228244147, 0.27384573228244147),
      (0.7372549019607844, 0.26423455393950784, 0.26423455393950784),
      (0.7411764705882353, 0.2547796171102232, 0.2547796171102232),
      (0.7450980392156863, 0.24549744147363167, 0.24549744147363167),
      (0.7490196078431373, 0.23640702046782996, 0.23640702046782996),
      (0.7529411764705882, 0.22753008846802553, 0.22753008846802553),
      (0.7568627450980392, 0.21888680972230756, 0.21888680972230756),
      (0.7607843137254902, 0.21050729653953204, 0.21050729653953204),
      (0.7647058823529411, 0.20242262578013887, 0.20242262578013887),
      (0.7686274509803921, 0.1946669682951214, 0.1946669682951214),
      (0.7725490196078432, 0.18727886565935878, 0.18727886565935878),
      (0.7764705882352941, 0.180302581654542, 0.180302581654542),
      (0.7803921568627451, 0.17378303911839907, 0.17378303911839907),
      (0.7843137254901961, 0.16776810781649396, 0.16776810781649396),
      (0.788235294117647, 0.1623050371038979, 0.1623050371038979),
      (0.792156862745098, 0.15743769157419057, 0.15743769157419057),
      (0.796078431372549, 0.15320277826395726, 0.15320277826395726),
      (0.8, 0.14962641946742813, 0.14962641946742813),
      (0.803921568627451, 0.1467193374830311, 0.1467193374830311),
      (0.807843137254902, 0.14447575713095867, 0.14447575713095867),
      (0.8117647058823529, 0.14287202964513893, 0.14287202964513893),
      (0.8156862745098039, 0.14186849196725745, 0.14186849196725745),
      (0.8196078431372549, 0.14141261825631932, 0.14141261825631932),
      (0.8235294117647058, 0.14144362461877844, 0.14144362461877844),
      (0.8274509803921568, 0.1418966965532168, 0.1418966965532168),
      (0.8313725490196078, 0.14270607585275075, 0.14270607585275075),
      (0.8352941176470589, 0.14380937764395385, 0.14380937764395385),
      (0.8392156862745098, 0.14514666211244054, 0.14514666211244054),
      (0.8431372549019608, 0.14666355322341185, 0.14666355322341185),
      (0.8470588235294118, 0.14830833235410426, 0.14830833235410426),
      (0.8509803921568627, 0.15003428180550066, 0.15003428180550066),
      (0.8549019607843137, 0.1517946748017894, 0.1517946748017894),
      (0.8588235294117647, 0.1535471889644062, 0.1535471889644062),
      (0.8627450980392157, 0.15524759622631187, 0.15524759622631187),
      (0.8666666666666667, 0.15685285246285416, 0.15685285246285416),
      (0.8705882352941177, 0.15832095225468892, 0.15832095225468892),
      (0.8745098039215686, 0.15960971195525955, 0.15960971195525955),
      (0.8784313725490196, 0.16067795901538687, 0.16067795901538687),
      (0.8823529411764706, 0.1614895452047332, 0.1614895452047332),
      (0.8862745098039215, 0.16201381167921866, 0.16201381167921866),
      (0.8901960784313725, 0.1622265257547594, 0.1622265257547594),
      (0.8941176470588235, 0.16210826979214402, 0.16210826979214402),
      (0.8980392156862745, 0.16165212012700822, 0.16165212012700822),
      (0.9019607843137255, 0.16085945689671105, 0.16085945689671105),
      (0.9058823529411765, 0.15972946784573275, 0.15972946784573275),
      (0.9098039215686274, 0.15828035700731968, 0.15828035700731968),
      (0.9137254901960784, 0.15651615354985451, 0.15651615354985451),
      (0.9176470588235294, 0.15446036095800122, 0.15446036095800122),
      (0.9215686274509803, 0.1521296397207116, 0.1521296397207116),
      (0.9254901960784314, 0.14954130408815758, 0.14954130408815758),
      (0.9294117647058824, 0.14671310199288928, 0.14671310199288928),
      (0.9333333333333333, 0.14366261504290215, 0.14366261504290215),
      (0.9372549019607843, 0.14040679468494072, 0.14040679468494072),
      (0.9411764705882353, 0.13695962321933544, 0.13695962321933544),
      (0.9450980392156862, 0.13333328824637855, 0.13333328824637855),
      (0.9490196078431372, 0.129545631583063, 0.129545631583063),
      (0.9529411764705882, 0.1256041268313333, 0.1256041268313333),
      (0.9568627450980391, 0.12152210646815674, 0.12152210646815674),
      (0.9607843137254902, 0.11730740371384013, 0.11730740371384013),
      (0.9647058823529412, 0.11297138893396706, 0.11297138893396706),
      (0.9686274509803922, 0.10851751538318564, 0.10851751538318564),
      (0.9725490196078431, 0.10395692102715784, 0.10395692102715784),
      (0.9764705882352941, 0.09929501197500162, 0.09929501197500162),
      (0.9803921568627451, 0.0945346966420831, 0.0945346966420831),
      (0.984313725490196, 0.08968329380554105, 0.08968329380554105),
      (0.9882352941176471, 0.08474472186508704, 0.08474472186508704),
      (0.9921568627450981, 0.07972236454569985, 0.07972236454569985),
      (0.996078431372549, 0.07461913567560219, 0.07461913567560219),
      (1.0, 0.06943744239412558, 0.06943744239412558)
    ]
  }
]
)});
  main.variable(observer("colors")).define("colors", function(){return(
new Map([
  ["avg", "#5b6187"],
  ["thresh", "#FEDB67"],
  ["below", "#89119c"], // actuals below forecast
  ["above", "pink"], // actuals above forecast
  ["moderate", "#FEDB67"],
  ["Strong", "#f26722"],
  ["Severe", "#cd3728"],
  ["Extreme", "#7E1416"],

  ["seas", "pink"]
])
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Buoy plot`
)});
  main.variable(observer("r")).define("r", function(){return(
"mapbox://styles/hakai/ckwpei0yq08cj15nthgd4ql45"
)});
  main.variable(observer("buoys")).define("buoys", function(){return(
[
  {
    short_name: "C46004",
    lat: 50.94,
    lon: -135.87,
    long_name: "Middle Nomad",
    pk: 1
  },
  {
    short_name: "C46036",
    lat: 48.3,
    lon: -133.86,
    long_name: "South Nomad",
    pk: 2
  },
  {
    short_name: "C46131",
    lat: 49.91,
    lon: -124.99,
    long_name: "Sentry Shoal",
    pk: 3
  },
  {
    short_name: "C46132",
    lat: 49.74,
    lon: -127.93,
    long_name: "South Brooks",
    pk: 4
  },
  {
    short_name: "C46134",
    lat: 48.66,
    lon: -123.48,
    long_name: "Pat Bay Test Buoy",
    pk: 5
  },
  {
    short_name: "C46145",
    lat: 54.38,
    lon: -132.42,
    long_name: "Central Dixon Entran",
    pk: 6
  },
  {
    short_name: "C46146",
    lat: 49.34,
    lon: -123.73,
    long_name: "Halibut Bank",
    pk: 7
  },
  {
    short_name: "C46147",
    lat: 51.83,
    lon: -131.23,
    long_name: "South Moresby",
    pk: 8
  },
  // {
  //   short_name: "C46181",
  //   lat: 53.82,
  //   lon: -128.84,
  //   long_name: "Nanakwa Shoal",
  //   pk: 9
  // },
  // {
  //   short_name: "C46182",
  //   lat: 49.48,
  //   lon: -123.29,
  //   long_name: "Pam Rocks",
  //   pk: 10
  // },
  {
    short_name: "C46183",
    lat: 53.57,
    lon: -131.14,
    long_name: "North Hecate Strait",
    pk: 11
  },
  {
    short_name: "C46184",
    lat: 53.92,
    lon: -138.85,
    long_name: "North Nomad",
    pk: 12
  },
  {
    short_name: "C46185",
    lat: 52.42,
    lon: -129.79,
    long_name: "South Hecate Strait",
    pk: 13
  },
  {
    short_name: "C46204",
    lat: 51.38,
    lon: -128.77,
    long_name: "West Sea Otter",
    pk: 14
  },
  {
    short_name: "C46205",
    lat: 54.3,
    lon: -133.4,
    long_name: "West Dixon Entrance",
    pk: 15
  },
  {
    short_name: "C46206",
    lat: 48.83,
    lon: -126,
    long_name: "La Perouse Bank",
    pk: 16
  },
  {
    short_name: "C46207",
    lat: 50.88,
    lon: -129.91,
    long_name: "East Dellwood",
    pk: 17
  },
  {
    short_name: "C46208",
    lat: 52.51,
    lon: -132.69,
    long_name: "West Moresby",
    pk: 18
  }
]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`For a date, find the heatwave status for each station`
)});
  main.variable(observer()).define(["buoyDailyData"], function(buoyDailyData){return(
buoyDailyData
)});
  main.variable(observer("selected")).define("selected", ["hexbyLocation","map"], function(hexbyLocation,map){return(
hexbyLocation.get(
  map.selected ? map.selected.data.lng + "|" + map.selected.data.lat : ""
) || []
)});
  main.variable(observer("hexbyLocation")).define("hexbyLocation", ["d3","hex"], function(d3,hex){return(
d3.group(hex, (d) => d.lng + "|" + d.lat)
)});
  main.variable(observer()).define(["time1"], function(time1){return(
new Date(time1).toISOString().substring(0, 10) === "2021-01-01"
)});
  main.variable(observer("HWsForDate")).define("HWsForDate", ["buoyDailyData","time1"], function(buoyDailyData,time1){return(
buoyDailyData.filter(
  (d) =>
    new Date(time1).toISOString().substring(0, 10) ===
    new Date(d.result_time).toISOString().substring(0, 10)
)
)});
  main.variable(observer()).define(["buoyDailyData"], function(buoyDailyData){return(
buoyDailyData.filter((d) => d.category === "Strong")
)});
  main.variable(observer("hex")).define("hex", ["buoys","time1","HWsForDate"], function(buoys,time1,HWsForDate)
{
  const data = [];
  for (let i = 0; i < buoys.length; i++) {
    data.push({
      name: buoys[i].long_name,
      station: buoys[i].pk,
      lat: buoys[i].lat,
      lng: buoys[i].lon,
      category: "none",
      day: time1
    });
  }
  // replace categories with real value
  if (HWsForDate.length > 0) {
    data.forEach((d) => {
      let sta = HWsForDate.find((h) => Number(h.station) === d.station);
      if (sta) {
        d.category = sta.category;
        d.ssta = sta.sst - sta.seas;
      }
    });
  }
  return data;
}
);
  main.variable(observer("dates")).define("dates", ["d3","dateExtent"], function(d3,dateExtent){return(
d3.timeDay
  .range(new Date(dateExtent[0]), new Date(dateExtent[1]))
  .map((d) => +d)
)});
  main.variable(observer("dateExtent")).define("dateExtent", function(){return(
[new Date("2015-01-01"), new Date()]
)});
  main.variable(observer("hexgeo")).define("hexgeo", ["hex","selected","colorView","sstaColors","colorMHW","opacityMHW"], function(hex,selected,colorView,sstaColors,colorMHW,opacityMHW){return(
hex.map((d, i) => {
  let sel = {};
  if (selected && selected[0]) {
    sel = selected[0];
  }
  return {
    id: i,
    properties: {
      ...d,
      stroke: d.lat == sel.lat && d.lng == sel.lng ? 2 : 0,
      mhwcolor:
        colorView === "anomaly" ? sstaColors(d.ssta) : colorMHW(d.category),
      mhwopacity: opacityMHW(d.category)
      // p03color: colorP03(d.p03),
      // p03opacity: opacityP03(d.p03)
    },
    geometry: { type: "Point", coordinates: [d.lng, d.lat] },
    type: "Feature"
  };
})
)});
  main.variable(observer("center")).define("center", ["projection","width","height"], function(projection,width,height){return(
projection.invert([width/2, height/2])
)});
  main.variable(observer("metersToPixelsAtMaxZoom")).define("metersToPixelsAtMaxZoom", function(){return(
(meters, latitude) =>
    meters / 0.075 / Math.cos(latitude * Math.PI / 180)
)});
  main.variable(observer("hexbinLayer")).define("hexbinLayer", ["metersToPixelsAtMaxZoom","center"], function(metersToPixelsAtMaxZoom,center)
{
  return {
    id: "hexbins",
    type: "circle",
    source: "hexbins",
    paint: {
      // keep the circles the same size
      // https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
      "circle-radius": {
        stops: [
          [0, 0],
          [6.2, metersToPixelsAtMaxZoom(2, center[1])]
        ],
        base: 2
      },
      "circle-stroke-color": "blue",
      "circle-stroke-width": ["get", "stroke"],
      "circle-color": ["get", "mhwcolor"],
      "circle-opacity": ["get", "mhwopacity"]
    }
  };
}
);
  main.variable(observer()).define(["limits"], function(limits){return(
limits[0]
)});
  main.variable(observer("dayBeforeStart")).define("dayBeforeStart", ["limits"], function(limits)
{
  const b = Object.assign(limits[0]);
  const fistDate = new Date(b);

  return new Date(fistDate.setDate(fistDate.getDate() - 1))
    .toISOString()
    .substring(0, 10);
}
);
  main.variable(observer()).define(["limits"], function(limits){return(
limits[0]
)});
  main.variable(observer()).define(["limits"], function(limits){return(
limits
)});
  main.variable(observer()).define(["dayBeforeStart"], function(dayBeforeStart){return(
dayBeforeStart
)});
  main.variable(observer("buoyDailyData")).define("buoyDailyData", ["dayBeforeStart","limits"], function(dayBeforeStart,limits)
{
  // let daysago = new Date().getDate() - 7;
  // let st = new Date(new Date().setDate(daysago));

  return fetch(
    "https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getDailySSTStats?startDate=" +
      dayBeforeStart +
      "&endDate=" +
      limits[1].toISOString().substring(0, 10) +
      ""
  )
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((d) => {
        d.ssta = d.sst - d.seas;
        d.diff = d.thresh;
        d.diffStrong = d.thresh;
        d.diffExtreme = d.thresh;
        d.diffSevere = d.thresh;
        if (d.category === "Strong") {
          d.diffStrong = Math.max(d.thresh, d.sst);
        }
        if (d.category === "Extreme") {
          d.diffExtreme = Math.max(d.thresh, d.sst);
        }
        if (d.category === "Severe") {
          d.diffSevere = Math.max(d.thresh, d.sst);
        }
        if (d.category === "Moderate") {
          d.diff = Math.max(d.thresh, d.sst);
        }
        // d.diff = Math.max(d.thresh, d.sst);
        d.date = new Date(d.result_time);
      });
      return data;
    });
}
);
  main.variable(observer("updateMapbox")).define("updateMapbox", ["hexgeo","map","hexbinLayer"], function(hexgeo,map,hexbinLayer)
{
  // This allows us to update the map with data without re-rendering the whole cell
  // There is a bit of weirdness around adding and removing the layer to make sure mapbox rerenders
  let fc = {
    type: "FeatureCollection",
    features: hexgeo
  };
  if (map._loaded) {
    if (!map.getSource("hexbins")) {
      map.addSource("hexbins", {
        type: "geojson",
        data: fc
      });
    } else {
      // console.log("setting source")
      map.getSource("hexbins").setData(fc);
    }
    if (map.getLayer(hexbinLayer.id)) {
      map.removeLayer(hexbinLayer.id);
    }
    // console.log("adding layer")
    map.addLayer(hexbinLayer);
    // map.flyTo(projection.invert([100,1000]))
    //   console.log("flying")
    // }
    return true;
  }
  return false;
}
);
  main.variable(observer()).define(["map"], function(map){return(
map._loaded
)});
  main.variable(observer()).define(["map"], function(map){return(
map.getSource("hexbins")
)});
  main.variable(observer("originalScale")).define("originalScale", function(){return(
25355.18980109889
)});
  main.variable(observer("scaleRatio")).define("scaleRatio", ["projection","originalScale"], function(projection,originalScale){return(
projection.scale() / originalScale
)});
  main.variable(observer("widthRatio")).define("widthRatio", ["width"], function(width){return(
width / 955
)});
  main.variable(observer("heightRatio")).define("heightRatio", ["height"], function(height){return(
height / 500
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height","topojson","BC_Midres"], function(d3,width,height,topojson,BC_Midres){return(
d3
  .geoAlbers()
  .rotate([126, 0])
  .fitSize(
    [width, height],
    topojson.feature(BC_Midres, BC_Midres.objects.BC_Midres_latlng)
  )
)});
  main.variable(observer("pixelRadius")).define("pixelRadius", ["scaleRatio","d3","widthRatio","heightRatio"], function(scaleRatio,d3,widthRatio,heightRatio){return(
100 * scaleRatio * d3.min([widthRatio, heightRatio])
)});
  main.variable(observer("hexbin")).define("hexbin", ["d3","width","height"], function(d3,width,height){return(
d3
  .hexbin()
  .extent([
    [0, 0],
    [width, height]
  ])
  .radius(100)
)});
  main.variable(observer("numOfDates")).define("numOfDates", ["d3","dateExtent"], function(d3,dateExtent){return(
d3.timeDay.count(...dateExtent)
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("colorMHW")).define("colorMHW", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  .domain(["none", "Moderate", "Strong", "Extreme", "Severe"])
  .range(["#31a354", "#FEDB67", "#f26722", "#7E1416", "#cd3728"])
)});
  main.variable(observer()).define(["opacityMHW"], function(opacityMHW){return(
opacityMHW("none")
)});
  main.variable(observer("opacityMHW")).define("opacityMHW", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  .domain(["none", "Moderate", "Strong", "Extreme", "Severe"])
)});
  main.variable(observer("colorPM1")).define("colorPM1", ["d3"], function(d3){return(
d3.scaleLinear()
  .domain([0,50, 100, 150, 200, 250])
  .range(["green", "yellow", "orange", "red", "maroon", "maroon"])
)});
  main.variable(observer("opacityPM1")).define("opacityPM1", ["d3"], function(d3){return(
d3.scaleLinear()
  .domain([0,50, 100, 150, 200, 250])
  .range([0.1, 0.5, 0.9, 0.9, 0.9, 0.9])
)});
  main.variable(observer("colorP03")).define("colorP03", ["d3"], function(d3){return(
d3.scaleLinear()
  .domain([1,1000, 5000, 10000, 20000, 25000])
  .range(["green", "yellow", "orange", "red", "maroon", "maroon"])
)});
  main.variable(observer("opacityP03")).define("opacityP03", ["d3"], function(d3){return(
d3
  .scaleLinear()
  .domain([1, 1000, 5000, 10000, 20000, 25000])
  .range([0.1, 0.75, 0.75, 0.9, 0.9, 0.9])
)});
  main.variable(observer("numFormat")).define("numFormat", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.variable(observer("timeFormat")).define("timeFormat", ["d3"], function(d3){return(
d3.timeFormat("%Y-%m-%d")
)});
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("legend", child2);
  const child3 = runtime.module(define3);
  main.import("BC_Midres", child3);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6.0.0-rc.3", "d3-hexbin@0.2")
)});
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require","html"], async function(require,html)
{
  const gl = await require("mapbox-gl");
  if (!gl.accessToken) {
    gl.accessToken =
      "pk.eyJ1IjoiaGFrYWkiLCJhIjoiY2lyNTcwYzY5MDAwZWc3bm5ubTdzOWtzaiJ9.6QhxH6sQEgK634qO7a8MoQ";
    const href = await require.resolve("mapbox-gl/dist/mapbox-gl.css");
    document.head.appendChild(html`<link href=${href} rel=stylesheet>`);
  }
  return gl;
}
);
  const child4 = runtime.module(define4);
  main.import("brushFilterX", child4);
  return main;
}
