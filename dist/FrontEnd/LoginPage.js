"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const Speak_1 = require("./Speak");
const inputmask_1 = __importDefault(require("inputmask"));
class LoginPage {
    static Page;
    static OnNavigate() {
        (0, Speak_1.speak)('Welcome');
    }
    static GetValue(selector) {
        return LoginPage.Page.find(selector).val().toString().replace(/\s/g, '');
    }
    static OnStartClick() {
        const FirstName = LoginPage.GetValue('#FirstName');
        const LastName = LoginPage.GetValue('#LastName');
        const DOB = new Date(LoginPage.GetValue('#DOB'));
        if (!FirstName) {
            window.alert('First Name cannot be empty');
            return;
        }
        if (!LastName) {
            window.alert('Last Name cannot be empty');
            return;
        }
        if (String(DOB) === 'Invalid Date' || DOB > new Date() || DOB < new Date('01/01/1900')) {
            window.alert('Invalid Date of Birth');
            return;
        }
        window.Profile = { FirstName, LastName, DOB, Subjective: [], OAP: [] };
        $('#SubjectivePage').trigger('navigate');
    }
    static RegisterEvents = function () {
        LoginPage.Page = $('#LoginPage');
        LoginPage.Page.on('navigate', LoginPage.OnNavigate);
        LoginPage.Page.on('click', '#StartButton', LoginPage.OnStartClick);
        (0, inputmask_1.default)('99/99/9999', { 'placeholder': 'MM/DD/YYYY' }).mask('#DOB');
    };
}
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map