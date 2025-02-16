"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerEvents = void 0;
const electron_1 = require("electron");
const Profile_1 = require("./Profile");
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
class ServerEvents {
    static RegisterEvents() {
        electron_1.ipcMain.on('show-alert', this.OnShowAlert);
        electron_1.ipcMain.on('show-confirm', this.OnShowConfirm);
        electron_1.ipcMain.on('show-context-menu', this.OnShowContextMenu);
        electron_1.ipcMain.on('save', this.OnSave);
        electron_1.ipcMain.on('load-charges', this.LoadChargesConfig);
        electron_1.ipcMain.on('save-charges', this.SaveCharges);
    }
    static OnShowContextMenu(event, MouseX, MouseY) {
        const EventBrowserWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
        const MenuItems = [
            {
                label: 'Reload',
                click: () => EventBrowserWindow.reload()
            },
            {
                label: 'Exit Program',
                click: () => EventBrowserWindow.close()
            },
            {
                label: 'Inspect Element',
                click: () => EventBrowserWindow.webContents.inspectElement(MouseX, MouseY)
            }
        ];
        electron_1.Menu.buildFromTemplate(MenuItems).popup({ window: EventBrowserWindow });
    }
    static OnShowAlert(event, message) {
        const EventBrowserWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
        const AlertOptions = {
            title: 'Alert',
            type: 'warning',
            buttons: ["Ok"],
            defaultId: 0,
            cancelId: 0,
            message
        };
        electron_1.dialog.showMessageBoxSync(EventBrowserWindow, AlertOptions);
    }
    static OnShowConfirm(event, message) {
        const EventBrowserWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
        const ConfirmOptions = {
            title: 'Confirm',
            type: 'question',
            buttons: ["Cancel", "Ok"],
            message
        };
        event.returnValue = electron_1.dialog.showMessageBoxSync(EventBrowserWindow, ConfirmOptions);
    }
    static GenerateNote(profile) {
        const header = Profile_1.ProfileParser.Header(profile);
        let sn = header.concat(Profile_1.ProfileParser.FullSubjectiveNote(profile));
        let ssn = header.concat(Profile_1.ProfileParser.ShortSubjectiveNote(profile));
        if (profile.SubjectiveAdditionalNotes) {
            const label = 'Additional Information: ';
            sn = sn.concat(label + profile.SubjectiveAdditionalNotes);
            ssn = ssn.concat(label + profile.SubjectiveAdditionalNotes);
        }
        ssn = ssn.concat('').concat(Profile_1.ProfileParser.ShortOAPNote(profile));
        sn = sn.concat('').concat(Profile_1.ProfileParser.FullOAPNote(profile));
        return { sn: sn.join('\r\n'), ssn: ssn.join('\r\n') };
    }
    static OnSave(event, profile) {
        const folder = 'admin/notes';
        !fs_1.default.existsSync(folder) && fs_1.default.mkdirSync(folder);
        const timestamp = (0, moment_1.default)().format('YYMMDDHHmm');
        const initials = profile.FirstName[0] + profile.LastName[0];
        const dob = (0, moment_1.default)(profile.DOB).format('MM-DD-YYYY');
        const snfile = `${folder}/${timestamp} SN ${initials} ${dob}.txt`;
        const ssnfile = `${folder}/${timestamp} SSN ${initials} ${dob}.txt`;
        const note = ServerEvents.GenerateNote(profile);
        fs_1.default.writeFileSync(snfile, note.sn);
        fs_1.default.writeFileSync(ssnfile, note.ssn);
        event.returnValue = true;
    }
    static LoadChargesConfig(event) {
        const file = 'admin/charges.json';
        if (!fs_1.default.existsSync(file)) {
            event.returnValue = { error: 'charges.json file not found' };
            return;
        }
        let config;
        try {
            config = JSON.parse(fs_1.default.readFileSync(file, 'utf8'));
            const prices = config.map(c => Number(c.price));
            if (prices.some(price => isNaN(price))) {
                event.returnValue = { error: 'Not all prices are proper numbers' };
                return;
            }
        }
        catch (error) {
            event.returnValue = { error: 'Failed to parse charges.json' };
            return;
        }
        event.returnValue = { charges: config };
    }
    static SaveCharges(event, profile, charges, details) {
        const folder = 'admin/receipts';
        !fs_1.default.existsSync(folder) && fs_1.default.mkdirSync(folder);
        const timestamp = (0, moment_1.default)().format('YYMMDDHHmm');
        const initials = profile.FirstName[0] + profile.LastName[0];
        const dob = (0, moment_1.default)(profile.DOB).format('MM-DD-YYYY');
        const file = `${folder}/${timestamp} Receipt ${initials} ${dob}.txt`;
        charges.forEach(c => {
            c.priceNum = Number(c.price);
            c.priceFormatted = '$' + c.priceNum.toFixed(2);
        });
        const total = charges.map(c => c.priceNum).reduce((prev, current) => prev + current);
        const totalLabel = 'Total';
        const totalFormatted = '$' + total.toFixed(2);
        const nameLength = Math.max(...charges.map(c => c.name.length), totalLabel.length);
        const priceLength = Math.max(...charges.map(c => c.priceFormatted.length), totalFormatted.length);
        const chargeLines = charges.map(c => `${c.name.padEnd(nameLength)} ${c.priceFormatted.padStart(priceLength)}`);
        const lineLength = nameLength + priceLength + 1;
        chargeLines.push(new Array(lineLength).fill('-').join(''));
        chargeLines.push(`${totalLabel.padEnd(nameLength)} ${totalFormatted.padStart(priceLength)}`);
        if (details) {
            chargeLines.push('');
            chargeLines.push(details);
        }
        const headerLines = [
            'Doctor: Carl Hedrick DC',
            `Patient: ${profile.FirstName} ${profile.LastName}`,
            `Date & Time: ${(0, moment_1.default)().format('MM-DD-YYYY HH:mm')}`,
            ''
        ];
        fs_1.default.writeFileSync(file, headerLines.concat(chargeLines).join('\r\n'));
        event.returnValue = true;
    }
}
exports.ServerEvents = ServerEvents;
//# sourceMappingURL=ServerEvents.js.map