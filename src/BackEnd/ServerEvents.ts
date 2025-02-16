import { 
    BrowserWindow,
    dialog,
    ipcMain,
    IpcMainEvent,
    Menu,
    MenuItemConstructorOptions,
    MessageBoxSyncOptions
} from 'electron'
import { Profile, ProfileParser } from './Profile'
import fs from 'fs'
import moment from 'moment'

export interface Charge 
{
    name: string
    price: string
    priceNum?: number
    priceFormatted?: string
}

export interface ChargesPayload
{
    error?: string
    charges?: Charge[]
}

export class ServerEvents
{
    static RegisterEvents()
    {
        ipcMain.on('show-alert', this.OnShowAlert)
        ipcMain.on('show-confirm', this.OnShowConfirm)
        ipcMain.on('show-context-menu', this.OnShowContextMenu)
        ipcMain.on('save', this.OnSave)
        ipcMain.on('load-charges', this.LoadChargesConfig)
        ipcMain.on('save-charges', this.SaveCharges)
    }

    private static OnShowContextMenu(event: IpcMainEvent, MouseX: number, MouseY: number)
    {
        const EventBrowserWindow = BrowserWindow.fromWebContents(event.sender)
        const MenuItems: MenuItemConstructorOptions[] = 
        [
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
        ]
        Menu.buildFromTemplate(MenuItems).popup({ window: EventBrowserWindow })
    }
    
    private static OnShowAlert(event: IpcMainEvent, message: string)
    {
        const EventBrowserWindow = BrowserWindow.fromWebContents(event.sender)
        const AlertOptions: MessageBoxSyncOptions =
        {
            title: 'Alert',
            type: 'warning',
            buttons: ["Ok"],
            defaultId: 0,
            cancelId: 0,
            message
        }
        dialog.showMessageBoxSync(EventBrowserWindow, AlertOptions)
    }
    
    private static OnShowConfirm(event: IpcMainEvent, message: string)
    {
        const EventBrowserWindow = BrowserWindow.fromWebContents(event.sender)
        const ConfirmOptions: MessageBoxSyncOptions = 
        {
            title: 'Confirm',
            type: 'question',
            buttons: ["Cancel", "Ok"],
            message
        }
        event.returnValue = dialog.showMessageBoxSync(EventBrowserWindow, ConfirmOptions)
    }

    private static GenerateNote(profile: Profile)
    {
        const header = ProfileParser.Header(profile)
        let sn = header.concat(ProfileParser.FullSubjectiveNote(profile))
        let ssn = header.concat(ProfileParser.ShortSubjectiveNote(profile))
        if(profile.SubjectiveAdditionalNotes)
        {
            const label = 'Additional Information: '
            sn = sn.concat(label + profile.SubjectiveAdditionalNotes)
            ssn = ssn.concat(label + profile.SubjectiveAdditionalNotes)
        }

        ssn = ssn.concat('').concat(ProfileParser.ShortOAPNote(profile))
        sn = sn.concat('').concat(ProfileParser.FullOAPNote(profile))

        return {sn: sn.join('\r\n'), ssn: ssn.join('\r\n')}
    }

    private static OnSave(event: IpcMainEvent, profile: Profile)
    {
        const folder = 'admin/notes'
        !fs.existsSync(folder) && fs.mkdirSync(folder)

        const timestamp = moment().format('YYMMDDHHmm')
        const initials = profile.FirstName[0] + profile.LastName[0]
        const dob = moment(profile.DOB).format('MM-DD-YYYY')
        const snfile = `${folder}/${timestamp} SN ${initials} ${dob}.txt`
        const ssnfile = `${folder}/${timestamp} SSN ${initials} ${dob}.txt`
        const note = ServerEvents.GenerateNote(profile)
        fs.writeFileSync(snfile, note.sn)
        fs.writeFileSync(ssnfile, note.ssn)

        event.returnValue = true
    }

    private static LoadChargesConfig(event: IpcMainEvent) {
        const file = 'admin/charges.json'
        if(!fs.existsSync(file)) {
            event.returnValue = {error: 'charges.json file not found'}
            return
        } 
        let config: Charge[]
        try {
            config = JSON.parse(fs.readFileSync(file, 'utf8'))
            const prices = config.map(c => Number(c.price))
            if(prices.some(price => isNaN(price))) {
                event.returnValue = {error: 'Not all prices are proper numbers'}
                return
            }
        }
        catch (error) {
            event.returnValue = {error: 'Failed to parse charges.json'}
            return
        }
        event.returnValue = {charges: config}
    }

    private static SaveCharges(event: IpcMainEvent, profile: Profile, charges: Charge[], details: string)
    {
        const folder = 'admin/receipts'
        !fs.existsSync(folder) && fs.mkdirSync(folder)
        const timestamp = moment().format('YYMMDDHHmm')
        const initials = profile.FirstName[0] + profile.LastName[0]
        const dob = moment(profile.DOB).format('MM-DD-YYYY')
        const file = `${folder}/${timestamp} Receipt ${initials} ${dob}.txt`

        charges.forEach(c => {
            c.priceNum = Number(c.price)
            c.priceFormatted = '$' + c.priceNum.toFixed(2)
        })
        const total = charges.map(c => c.priceNum).reduce((prev, current) => prev + current)
        const totalLabel = 'Total'
        const totalFormatted = '$' + total.toFixed(2)

        const nameLength = Math.max(...charges.map(c => c.name.length), totalLabel.length)
        const priceLength = Math.max(...charges.map(c => c.priceFormatted.length), totalFormatted.length)
        const chargeLines = charges.map(c => `${c.name.padEnd(nameLength)} ${c.priceFormatted.padStart(priceLength)}`)
        
        const lineLength = nameLength + priceLength + 1
        chargeLines.push(new Array(lineLength).fill('-').join(''))
        chargeLines.push(`${totalLabel.padEnd(nameLength)} ${totalFormatted.padStart(priceLength)}`)
        
        if(details) {
            chargeLines.push('')
            chargeLines.push(details)
        }

        const headerLines = [
            'Doctor: Carl Hedrick DC',
            `Patient: ${profile.FirstName} ${profile.LastName}`,
            `Date & Time: ${moment().format('MM-DD-YYYY HH:mm')}`,
            ''
        ]

        fs.writeFileSync(file, headerLines.concat(chargeLines).join('\r\n'))
        event.returnValue = true
    }
}