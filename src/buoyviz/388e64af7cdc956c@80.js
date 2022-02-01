// https://observablehq.com/@observablehq/plot-select@80
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["aapl.csv",new URL("./files/3ccff97fd2d93da734e76829b2b066eafdaac6a1fafdec0faf6ebc443271cfc109d29e80dd217468fcb2aff1e6bffdc73f356cc48feb657f35378e6abbbb63b9",import.meta.url)],["goog.csv",new URL("./files/3ca44f93993f84575ab5461b4097d37b814438266e8cfe8774f70882f49bb289143c190963a158e8dc886989433af1161798ba76f2f4b36d17cc7150cba94477",import.meta.url)],["amzn.csv",new URL("./files/51ef8c06edd5d139385ad9477c0a42cbf0152f5a4facf30a52d5eaa3ce4debecf1114c4a51199e734274e4411ec8149ffdd0d094cd334095cf8f2a004fc90d44",import.meta.url)],["ibm.csv",new URL("./files/c56b9e232d72bf1df96ca3eeca37e29e811adb72f49d943659a0006c015e74d2c429186d9dca251060784f364eb2a16fd39584695d523588bdcb87e4d9eac650",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none">Select Transform / Observable Plot</h1><a href="/@observablehq/plot?collection=@observablehq/plot">Observable Plot</a> › <a href="/@observablehq/plot-transforms?collection=@observablehq/plot">Transforms</a> › Select · <a href="https://github.com/observablehq/plot/blob/main/README.md#select">API</a></div>

# Plot: Select

The select transform filters marks. It is similar to the basic [filter transform](/@observablehq/plot-transforms?collection=@observablehq/plot) except that it provides convenient shorthand for pulling a single value out of each series. The data are grouped into series using the *z*, *fill*, or *stroke* channel in the same fashion as the [area](/@observablehq/plot-area?collection=@observablehq/plot) and [line](/@observablehq/plot-line?collection=@observablehq/plot) marks.`
)});
  main.variable(observer("stocks")).define("stocks", ["FileAttachment"], async function(FileAttachment){return(
(await Promise.all([FileAttachment("aapl.csv"), FileAttachment("amzn.csv"), FileAttachment("goog.csv"), FileAttachment("ibm.csv")]
  .map(async file => [file.name.slice(0, -4).toUpperCase(), await file.csv({typed: "true"})])))
  .flatMap(([Symbol, data]) => data.map(d => ({Symbol, ...d})))
)});
  main.variable(observer()).define(["Plot","stocks"], function(Plot,stocks){return(
Plot.plot({
  marginRight: 40,
  y: {
    grid: true,
    label: "↑ Price ($)"
  },
  marks: [
    Plot.line(stocks, {x: "Date", y: "Close", stroke: "Symbol"}),
    Plot.text(stocks, Plot.selectLast({x: "Date", y: "Close", z: "Symbol", text: "Symbol", textAnchor: "start", dx: 3}))
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<a title="Plot" style="display: inline-flex; align-items: center; font: 600 14px var(--sans-serif);" href="/@observablehq/plot-interval?collection=@observablehq/plot">Next<svg width="8" height="16" fill="none" stroke-width="1.8" style="margin-left: 0.25em; padding-top: 0.25em;"><path d="M2.75 11.25L5.25 8.25L2.75 5.25" stroke="currentColor"></path></svg></a>  
<a title="Plot: Select" style="display: inline-flex; align-items: center; font: 600 14px var(--sans-serif);" href="https://github.com/observablehq/plot/blob/main/README.md#select">API Reference<svg width="8" height="16" fill="none" stroke-width="1.8" style="margin-left: 0.25em; padding-top: 0.25em;"><path d="M2.75 11.25L5.25 8.25L2.75 5.25" stroke="currentColor"></path></svg></a>`
)});
  return main;
}
