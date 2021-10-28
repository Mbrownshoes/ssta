import * as d3 from 'd3'

const minMaxValueToUse = 4
const count = 555976

d3.csv('./data/monthOfDailyData.csv').then(function (data) {
  // functions
  function normalizedAnomalyCalc (data) {
    // console.log(data);

    const out = d3.map(data, (d) => {
      if (d.sst === 'NA') {
        // console.log(d);
        d.sst = 0
      }
      const anom =
        (d.sst - -minMaxValueToUse) / (minMaxValueToUse - -minMaxValueToUse)
      return anom > 1 ? 1 : anom < 0 ? 0 : anom
    })
    return out
  }

  function makeColors (dataset) {
    const scaleAnomaly = d3
      .scaleDiverging((t) => d3.interpolateRdBu(1 - t))
      .domain([0, 0.5, 1])
    const count = dataset.length
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      const d3Colors = d3.color(scaleAnomaly(dataset[i]))

      colors[i3 + 0] = d3Colors.r / 255
      colors[i3 + 1] = d3Colors.g / 255
      colors[i3 + 2] = d3Colors.b / 255
      // mutable debug = positionOnGlobe;
    }
    return colors
  }

  for (let i = 0; i < data.length; i += count) {
    const dayofData = data.slice(i, i + count)

    const day = makeColors(normalizedAnomalyCalc(dayofData))
    // console.log('hi')
    postMessage(day)
  }
})
// setTimeout(() => {
//   postMessage('Hello World!')
// }, 5000)
