import $ from 'jquery'
import bootstrap from 'bootstrap'
import { ipcRenderer } from 'electron'
import { Components } from './Components'
import { speak, speakLetters, toggleSpeech } from './Speak'
import { Profile } from '../BackEnd/Profile'
import { Charge, ChargesPayload } from '../BackEnd/ServerEvents'


declare global 
{
    interface Window 
    {
        $: JQueryStatic
        Profile: Profile
        save: () => boolean
        jQuery: JQueryStatic
        bootstrap: typeof bootstrap
        charges: Charge[]
    }
}

class PageSetup
{
    static RegisterEvents()
    {
        window.alert = (message: string) => ipcRenderer.send('show-alert', message)
        window.confirm = (message: string) => ipcRenderer.sendSync('show-confirm', message)
        window.addEventListener('contextmenu', (event: MouseEvent) => ipcRenderer.send('show-context-menu', event.x, event.y), false)
        window.save = () => ipcRenderer.sendSync('save', window.Profile)
    }

    static RegisterGlobalObjects()
    {
        window.$ = window.jQuery = $
        window.bootstrap = bootstrap
        const payload: ChargesPayload = ipcRenderer.sendSync('load-charges')
        if(payload.error) {
            window.alert(payload.error)
            return
        }
        window.charges = payload.charges
    }

    static LoadHTML(_: number, element: Element)
    {
        const LoadRequestSettings: JQueryAjaxSettings =
        {
            async: false,
            url: element.getAttribute('src')
        }
        element.innerHTML = $.ajax(LoadRequestSettings).responseText
    }

    static OnPageNavigate(event: JQuery.TriggeredEvent)
    {
        $('.Page').addClass('Hidden')
        $(event.target).removeClass('Hidden')
    }

    static OnSpeechFocus(event: JQuery.TriggeredEvent)
    {
        const speech = (event.target as HTMLElement).getAttribute('speech')
        if(speech) speak(speech)
    }

    static OnSpeechBlur(event: JQuery.TriggeredEvent)
    {
        const element = (event.target as HTMLInputElement)
        if(element.value) speakLetters(element.value)
    }

    static OnDocumentKeyDown(event: JQuery.TriggeredEvent)
    {
        if (event.ctrlKey && event.key === 's') toggleSpeech()
    }

    static OnSelectChange(event: JQuery.TriggeredEvent)
    {
        const el = $(event.target)
        const val = $(event.target).val()
        el.css({opacity: !!val ? 1 : 0.5})
    }

    static OnDocumentReady()
    {
        $('load').each(PageSetup.LoadHTML)
        $(document).on('keydown', PageSetup.OnDocumentKeyDown)
        $('.Page').on('navigate', PageSetup.OnPageNavigate)
        $('[speech]').on('focus', PageSetup.OnSpeechFocus)
        $('input').on('blur', PageSetup.OnSpeechBlur)
        $('select').on('change', PageSetup.OnSelectChange)
        Components.forEach(c => c.RegisterEvents())
        $('#LoginPage').trigger('navigate')
    }
}

PageSetup.RegisterEvents()
PageSetup.RegisterGlobalObjects()
jQuery(PageSetup.OnDocumentReady)