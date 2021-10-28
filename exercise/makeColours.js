
var fs = require('fs')
const csv = require('fast-csv')
var d3 = require('d3')

const minMaxValueToUse = 4

function normalizedAnomalyCalc (data) {
  // console.log(data);

  const out = data.map((d) => {
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

var dataArr = []
csv.parseFile('./static/data/monthOfDailyData.csv', { headers: true })
  .on('data', data => {
    dataArr.push(data)
  })
  .on('end', () => {
    const colors = normalizedAnomalyCalc(dataArr)
    console.log(colors[1])
  // > 4187
  })
