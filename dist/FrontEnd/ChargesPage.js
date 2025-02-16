"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargesPage = void 0;
const electron_1 = require("electron");
class ChargesPage {
    static Page;
    static OnNavigate() {
        const chargeChecks = window.charges.map((c, i) => `
            <div class="form-group">
                <div class="form-check">
                    <input class="form-check-input ChargeCheck" type="checkbox" value="${i}" id="charge_${i}">
                    <label class="form-check-label" for="charge_${i}">
                        ${c.name} ($${c.price})
                    </label>
                </div>
            </div>
        `);
        document.getElementById('ChargesDiv').innerHTML = chargeChecks.join('');
    }
    static OnChargesSubmitButtonClick() {
        const checks = [...$('.ChargeCheck:checked')].map((e) => window.charges[Number(e.value)]);
        const details = $('#ChargesDetails').val().toString();
        electron_1.ipcRenderer.sendSync('save-charges', window.Profile, checks, details);
        window.location.reload();
    }
    static RegisterEvents = function () {
        ChargesPage.Page = $('#ChargesPage');
        ChargesPage.Page.on('navigate', ChargesPage.OnNavigate);
        ChargesPage.Page.on('click', '#ChargesSubmitButton', ChargesPage.OnChargesSubmitButtonClick);
    };
}
exports.ChargesPage = ChargesPage;
//# sourceMappingURL=ChargesPage.js.map