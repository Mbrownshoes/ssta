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
brushFilterX([d3.utcYear.offset(d3.utcDay(), -1), d3.utcDay()], {
  defaultExtent: [ d3.utcParse("%Y-%m-%d")("2021-01-01"), d3.utcParse("%Y-%m-%d")("2021-03-01") ]
})
)});
  main.variable(observer("test2")).define("test2", ["Generators", "viewof test2"], (G, _) => G.input(_));
  main.variable(observer()).define(["test2"], function(test2){return(
test2
)});
  main.variable(observer()).define(["width"], function(width){return(
width
)});
  main.variable(observer("brushFilterX")).define("brushFilterX", ["d3","width","Event"], function(d3,width,Event){return(
function (
  extent,
  {
    defaultExtent,
    margin = { top: 10, right: 20, bottom: 20, left: 65 },
    height = 50
  } = {}
) {
  const x = d3
    .scaleTime()
    .domain(extent)
    .range([margin.left, width - margin.right]);

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom + 1})`)
      .call(d3.axisBottom(x).ticks(width < 710 ? 6 : 10));

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);
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
