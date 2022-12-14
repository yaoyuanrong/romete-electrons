const { app } = require('electron')
const handleIPC = require('./ipc')
const { create: createMainWindow, 
	        show: showMainWindow,
				 close: closeMainWindow,
				send: sendMainWindow } = require('./windows/main')
const isDev = require('electron-is-dev')
const signal = require('./signal')

// 禁止多开
const gotTheLock = app.requestSingleInstanceLock()
	if(!gotTheLock) {
		app.quit()
	} else {
		app.on('second-instance', () => {
			showMainWindow()
		})
		app.on('ready',() => {
			createMainWindow()
			handleIPC()
			require('./trayAndMenu/index.js')
			
		})
		
		app.on('before-quit', () => {
			signal.send('control-quit-fresh')
			
			closeMainWindow()
		})
		app.on('activate', () => {
			showMainWindow()
			
		})
		app.on('will-finish-launching', () => {
			if(!isDev) {
				require('./updater.js')
			}
		})
}

