"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ServerEvents_1 = require("./ServerEvents");
class Server {
    static AppWindow;
    static AppWindowOptions = {
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        title: 'SOAP Dispenser',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    };
    static CreateWindow() {
        Server.AppWindow = new electron_1.BrowserWindow(Server.AppWindowOptions);
        Server.AppWindow.loadFile('dist/FrontEnd/MainPage.html');
        if (process.argv.length > 2 && process.argv[2] === 'dev')
            Server.AppWindow.webContents.openDevTools();
    }
    static OnAppSecondInstance() {
        if (!Server.AppWindow)
            return;
        Server.AppWindow.restore();
        Server.AppWindow.focus();
    }
    static Start() {
        !electron_1.app.requestSingleInstanceLock() && electron_1.app.quit();
        ServerEvents_1.ServerEvents.RegisterEvents();
        electron_1.app.on('second-instance', this.OnAppSecondInstance);
        electron_1.app.on('window-all-closed', () => process.platform !== 'darwin' && electron_1.app.quit());
        electron_1.app.whenReady().then(this.CreateWindow);
    }
}
Server.Start();
//# sourceMappingURL=Server.js.map