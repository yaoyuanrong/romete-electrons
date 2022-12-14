/**
 * @info 通过信令服务
 *       基于WebRTC的RTCDataChannel
 *         -无服务端依赖，p2p传输
 *         -基于sctp（传输层，有着tcp、udp的优点）
 */
const { ipcMain } = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')
const { size } = require('./windows/main')
let mouseUpFlag = false
function screenData(data) {
  data.screen = {
    width: size().width,
    height: size().height,
  }
  let {clientX, clientY, screen, video} = data
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  let x = clientX * screen.width / video.width
  let y = clientY * screen.height / (video.height - 25)

  return { x,y }
}
function handleClick(data, type) {
  if (type === 'dbclick') {
    robot.mouseClick('left', true)
  } else if (type === 'clickRight') {
    robot.mouseClick('right')
  }
}
function handleMouseDownorUp(data, type) {
  // let {x,y} = screenData(data)
  if (type === 'up') { console.log('up')
    robot.mouseToggle('up')
    mouseUpFlag = false
  } else if (type === 'down') { console.log('down')
    robot.mouseToggle('down')
    mouseUpFlag = true
  }
}
function handleMouseMove(data) {
  let {x,y} = screenData(data)
  if (mouseUpFlag) {
    robot.dragMouse(x, y);
  } else {
    robot.moveMouse(x, y)
  }
}
function handleMousewheel ({x ,y}) {
  robot.scrollMouse(x, y);
}
function handleKey(data) {
  // data {KeyCode, meta, alt, ctrl, shift} 
  try {
    const modifiers = []
    if(data.meta)modifiers.push('meta')
    if(data.shift)modifiers.push('shift')
    if(data.alt)modifiers.push('alt')
    if(data.control)modifiers.push('control')
    let key = vkey[data.keyCode].toLowerCase()
    let RexStr = /\<|\>|\"|\'|\&/g
    robot.keyTap(key.replace(RexStr,''),modifiers);
  } catch (err) {
    console.log(err)
  }

}
module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    if(type === 'dbclick') {
      handleClick(data,'dbclick')
    }else if(type === 'key') {
      handleKey(data)
    }else if (type === 'mouseMove') {
      handleMouseMove(data)
    }else if (type === 'clickRight') {
      handleClick(data, 'clickRight')
    } else if (type === 'down' || type === 'up') {
      handleMouseDownorUp(data, type)
    } else if (type === 'mousewheel') {
      handleMousewheel(data)
    }
  })
}

