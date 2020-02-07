import printMe from '@/print'

const  helpers = require('../common.js')
document.body.append(
  _.join(['Another', 'module', 'loaded!'], ' '),
)
printMe()
debugger;
helpers.test()
