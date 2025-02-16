"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const bootstrap_1 = __importDefault(require("bootstrap"));
const electron_1 = require("electron");
const Components_1 = require("./Components");
const Speak_1 = require("./Speak");
class PageSetup {
    static RegisterEvents() {
        window.alert = (message) => electron_1.ipcRenderer.send('show-alert', message);
        window.confirm = (message) => electron_1.ipcRenderer.sendSync('show-confirm', message);
        window.addEventListener('contextmenu', (event) => electron_1.ipcRenderer.send('show-context-menu', event.x, event.y), false);
        window.save = () => electron_1.ipcRenderer.sendSync('save', window.Profile);
    }
    static RegisterGlobalObjects() {
        window.$ = window.jQuery = jquery_1.default;
        window.bootstrap = bootstrap_1.default;
        const payload = electron_1.ipcRenderer.sendSync('load-charges');
        if (payload.error) {
            window.alert(payload.error);
            return;
        }
        window.charges = payload.charges;
    }
    static LoadHTML(_, element) {
        const LoadRequestSettings = {
            async: false,
            url: element.getAttribute('src')
        };
        element.innerHTML = jquery_1.default.ajax(LoadRequestSettings).responseText;
    }
    static OnPageNavigate(event) {
        (0, jquery_1.default)('.Page').addClass('Hidden');
        (0, jquery_1.default)(event.target).removeClass('Hidden');
    }
    static OnSpeechFocus(event) {
        const speech = event.target.getAttribute('speech');
        if (speech)
            (0, Speak_1.speak)(speech);
    }
    static OnSpeechBlur(event) {
        const element = event.target;
        if (element.value)
            (0, Speak_1.speakLetters)(element.value);
    }
    static OnDocumentKeyDown(event) {
        if (event.ctrlKey && event.key === 's')
            (0, Speak_1.toggleSpeech)();
    }
    static OnSelectChange(event) {
        const el = (0, jquery_1.default)(event.target);
        const val = (0, jquery_1.default)(event.target).val();
        el.css({ opacity: !!val ? 1 : 0.5 });
    }
    static OnDocumentReady() {
        (0, jquery_1.default)('load').each(PageSetup.LoadHTML);
        (0, jquery_1.default)(document).on('keydown', PageSetup.OnDocumentKeyDown);
        (0, jquery_1.default)('.Page').on('navigate', PageSetup.OnPageNavigate);
        (0, jquery_1.default)('[speech]').on('focus', PageSetup.OnSpeechFocus);
        (0, jquery_1.default)('input').on('blur', PageSetup.OnSpeechBlur);
        (0, jquery_1.default)('select').on('change', PageSetup.OnSelectChange);
        Components_1.Components.forEach(c => c.RegisterEvents());
        (0, jquery_1.default)('#LoginPage').trigger('navigate');
    }
}
PageSetup.RegisterEvents();
PageSetup.RegisterGlobalObjects();
jQuery(PageSetup.OnDocumentReady);
//# sourceMappingURL=PageSetup.js.map