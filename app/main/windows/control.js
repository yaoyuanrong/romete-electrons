const { BrowserWindow }  = require('electron');
const path = require('path')
const signal = require('../signal')
let win
function create() {
  win = new BrowserWindow({
    width: 1000,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.webContents.openDevTools()
  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
  win.on('close', (e) => {
    console.log('closed','close-control-window')
    signal.send('close-control-window', {})
    e.preventDefault()
    // win = null
	})
}
function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}
function close() {
  console.log('controlClose')
	win.close()
}
function reload() {
  win.reload()
}
module.exports = { create, send, close, reload }