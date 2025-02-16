import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { ServerEvents } from './ServerEvents'

class Server
{
    private static AppWindow : BrowserWindow
    private static readonly AppWindowOptions: BrowserWindowConstructorOptions = 
    {
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        title: 'SOAP Dispenser',
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
        }
    }

    private static CreateWindow()
    {
        Server.AppWindow = new BrowserWindow(Server.AppWindowOptions)
        Server.AppWindow.loadFile('dist/FrontEnd/MainPage.html')
        if(process.argv.length > 2 && process.argv[2] === 'dev')
            Server.AppWindow.webContents.openDevTools()
    }

    private static OnAppSecondInstance()
    {
        if (!Server.AppWindow) return
        Server.AppWindow.restore()
        Server.AppWindow.focus()
    }

    static Start()
    {
        !app.requestSingleInstanceLock() && app.quit()
        ServerEvents.RegisterEvents()
        app.on('second-instance', this.OnAppSecondInstance);
        app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
        app.whenReady().then(this.CreateWindow)
    }
}

Server.Start()