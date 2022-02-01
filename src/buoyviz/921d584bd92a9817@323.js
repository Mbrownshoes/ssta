export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Brush Filter X`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Function to create a brushable axis, uses data flow to expose values in a \`viewof\`. Currently uses a time scale, though that could be configured / extended. `
)});
  main.variable(observer()).define(["test"], function(test){return(
test
)});
  main.variable(observer("viewof test")).define("viewof test", ["brushFilterX","d3"], function(brushFilterX,d3){return(
brushFilterX([d3.utcYear.offset(d3.utcDay(), -1), d3.utcDay()])
)});
  main.variable(observer("test")).define("test", ["Generators", "viewof test"], (G, _) => G.input(_));
  main.variable(observer("viewof test2")).define("viewof test2", ["brushFilterX","d3"], function(brushFilterX,d3){return(
brushFilterX(
  [d3.utcYear.offset(d3.utcDay(), -10), d3.utcDay()],
  {
    defaultExtent: [
      d3.utcParse("%Y-%m-%d")("2018-03-01"),
      d3.utcParse("%Y-%m-%d")("2018-12-01")
    ]
  }
)
)});
  main.variable(observer("test2")).define("test2", ["Generators", "viewof test2"], (G, _) => G.input(_));
  main.variable(observer("alldates")).define("alldates", ["d3","dateExtent"], function(d3,dateExtent){return(
d3.timeMonth
  .range(new Date(dateExtent[0]), new Date(dateExtent[1]))
  .map((d) => d.toISOString().substring(0, 10))
)});
  main.variable(observer("dateExtent")).define("dateExtent", ["d3"], function(d3){return(
[d3.utcYear.offset(d3.utcDay(), -9), d3.utcDay()]
)});
  main.variable(observer()).define(["d3"], function(d3){return(
d3.isoParse("2019-03-01")
)});
  main.variable(observer()).define(["d3","hwEvent"], function(d3,hwEvent){return(
d3.utcParse("%Y-%m-%d")(hwEvent[1].date)
)});
  main.variable(observer()).define(["width"], function(width){return(
width
)});
  main.variable(observer("hwEvent")).define("hwEvent", function(){return(
[
  { date: "2013-10-01", value: 1 },
  { date: "2013-11-01", value: 1 },
  { date: "2013-12-01", value: 1 },
  { date: "2014-01-01", value: 1 },
  { date: "2014-02-01", value: 1 },
  { date: "2014-03-01", value: 1 },
  { date: "2014-04-01", value: 1 },
  { date: "2014-05-01", value: 1 },
  { date: "2014-06-01", value: 1 },
  { date: "2014-07-01", value: 1 },
  { date: "2014-08-01", value: 1 },
  { date: "2014-09-01", value: 1 },
  { date: "2014-10-01", value: 1 },
  { date: "2014-11-01", value: 1 },
  { date: "2014-12-01", value: 1 },
  { date: "2015-01-01", value: 1 },
  { date: "2015-02-01", value: 1 },
  { date: "2015-03-01", value: 1 },
  { date: "2015-04-01", value: 1 },
  { date: "2015-05-01", value: 1 },
  { date: "2015-06-01", value: 1 },
  { date: "2015-07-01", value: 1 },
  { date: "2015-08-01", value: 1 },
  { date: "2015-09-01", value: 1 },
  { date: "2015-10-01", value: 1 },
  { date: "2015-11-01", value: 1 },
  { date: "2015-12-01", value: 1 },
  { date: "2016-01-01", value: 1 },
  { date: "2016-02-01", value: 1 },
  { date: "2016-03-01", value: 1 },
  { date: "2016-04-01", value: 1 },
  { date: "2016-05-01", value: 1 },
  { date: "2016-06-01", value: 1 },
  { date: "2016-07-01", value: 1 },
  { date: "2016-08-01", value: 1 },
  { date: "2016-09-01", value: 1 },
  { date: "2016-10-01", value: 1 },
  { date: "2016-11-01", value: 1 },
  { date: "2019-08-01", value: 1 },
  { date: "2019-09-01", value: 1 },
  { date: "2019-10-01", value: 1 },
  { date: "2019-11-01", value: 1 }
]
)});
  main.variable(observer("margin")).define("margin", function(){return(
{ top: 10, right: 20, bottom: 20, left: 65 }
)});
  main.variable(observer()).define(["hwEvent"], function(hwEvent){return(
new Date(hwEvent[3].date).toISOString().substring(0, 10)
)});
  main.variable(observer("brushFilterX")).define("brushFilterX", ["d3","width","alldates","hwEvent","Event"], function(d3,width,alldates,hwEvent,Event){return(
function (
  extent,
  {
    defaultExtent,
    margin = { top: 10, right: 20, bottom: 20, left: 65 },
    height = 50
  } = {}
) {
  const y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleTime()
    .domain(extent)
    .range([margin.left, width - margin.right]);

  const x1 = d3
    .scaleBand()
    .rangeRound([margin.left, width - margin.right], 0.01)
    .padding(0)
    .domain(alldates);

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom + 1})`)
      .call(d3.axisBottom(x).ticks(width < 710 ? 6 : 10));

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg
    .selectAll("rect")
    // .data(fakeData)
    .data(hwEvent)
    // .data(fakeData)
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.date))
    .attr("y", (d) => {
      // console.log(d.date, x1(d.date));
      return y(d.value);
    })
    .attr("width", (d) => x1.bandwidth())
    .attr("height", (d) => y(0) - y(d.value))
    .attr("fill", (d) => "rgba(201, 37, 41,.7)");

  svg
    .selectAll("text")
    .data(["brush to", "filter"])
    .join("text")
    .text((d) => d)
    .style("font-size", 10)
    .style("font-family", "sans-serif")
    .attr("dx", 10)
    .attr("dy", (d, i) => margin.top + 10 + i * 10);

  const brush = d3
    .brushX()
    .extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom]
    ])
    .on(" end", brushed);

  svg.append("g").call(xAxis);

  let b = svg.append("g").call(brush);
  if (defaultExtent) b.call(brush.move, defaultExtent.map(x));

  function brushed(event) {
    svg.node().value =
      event.selection === null ? null : event.selection.map(x.invert);
    svg.node().dispatchEvent(new Event("input", { bubbles: true }));
    const selection = event.selection;
  }

  svg.node().value = defaultExtent ? defaultExtent : null;
  return svg.node();
}
)});
  return main;
}
