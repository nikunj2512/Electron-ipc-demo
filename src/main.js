const electron = require('electron');
const countdown = require('./countdown');
const app = electron.app;
const path = require('path');
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const Menu = electron.Menu;
/* Electron System Tray*/
const Tray = electron.Tray;

const windows = [];

app.on('ready', _ => {
    [1].forEach(_ => {
        let win = new BrowserWindow({
            height: 400,
            width: 400
        });

        win.loadURL(`file://${__dirname}/countdown.html`);

        win.on('closed', _ => {
            win = null;
        });


        const name = electron.app.getName();
        const template = [{
            label: name,
            submenu: [{
                label: `About ${name}`,
                click: _ => {
                    console.log('clicked about');
                }
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                click: _ => {
                    app.quit()
                },
                accelerator: 'Ctrl+Q'
            }]
        }];

        const tray = new Tray(path.join('src', 'Pikachu.png'));
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        tray.setContextMenu(menu);
        tray.setToolTip('Electron IPC');
        windows.push(win);
    });
});

ipc.on('countdown-start', _ => {
    countdown(count => {
        console.log('count', count);
        windows.forEach(win => {
            win.webContents.send('countdown', count);
        });
    });
});