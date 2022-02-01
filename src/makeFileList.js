const fs = require("fs")
const path = './static/textures/'

const filesArray = fs.readdirSync(path).filter(file => fs.lstatSync(path+file).isFile())
console.log(filesArray.length)
filesArray.unshift("files")

fs.writeFileSync('static/names.csv', filesArray.join(',\n'));
