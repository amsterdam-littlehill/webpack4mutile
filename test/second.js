import printMe from '@/print'
import(/*webpackPreload:true*/ /*webpackChunkName:"lodash"*/ 'lodash').then((_) => {
  console.log(
    _.join(['Another', 'module', 'loaded!'], ' '),
  )
  printMe();
})
