import * as d3 from 'd3'

d3.csv('./data/monthOfDailyData.csv').then(function (data) {
  postMessage(data)
})
// setTimeout(() => {
//   postMessage('Hello World!')
// }, 5000)
