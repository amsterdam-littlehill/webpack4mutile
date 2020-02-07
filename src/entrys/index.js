import 'babel-polyfill'
import image from '@/image/11.png'
import printMe from '@/print'

let img = new Image()
printMe()
img.src = image
document.body.append(img)
