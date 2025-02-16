"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordPage = void 0;
const Profile_1 = require("../BackEnd/Profile");
class PasswordPage {
    static Page;
    static PasswordModal;
    static ConfirmModel;
    static OnSubjectiveSummaryButtonClick = function () {
        PasswordPage.PasswordModal.show();
        $('#PasswordInput').trigger('focus');
    };
    static OnSubjectiveSummaryButtonKeyUp = function (event) {
        event.key === 'Enter' && $('#SubjectiveSummaryButton').trigger('click');
    };
    static OnPasswordInputKeyUp = function (event) {
        event.key === 'Enter' && $('#PasswordSubmitButton').trigger('click');
    };
    static OnPasswordSubmitButtonClick = function () {
        const input = $('#PasswordInput').val();
        if (input !== '259') {
            window.alert('Invalid passcode');
            return;
        }
        const header = Profile_1.ProfileParser.Header(window.Profile);
        const ssn = Profile_1.ProfileParser.ShortSubjectiveNote(window.Profile);
        document.getElementById('ShortSubjective').innerHTML = header.concat(ssn).join('<br>');
        PasswordPage.PasswordModal.hide();
        PasswordPage.ConfirmModel.show();
    };
    static OnSubjectiveConfirmButtonClick = function () {
        window.Profile.SubjectiveAdditionalNotes = $('#SubjectiveAdditionalNotes').val().toString();
        PasswordPage.ConfirmModel.hide();
        $('#OAPPage').trigger('navigate');
    };
    static RegisterEvents = function () {
        PasswordPage.Page = $('#PasswordPage');
        PasswordPage.ConfirmModel = new window.bootstrap.Modal('#SubjectiveConfirmModel');
        PasswordPage.PasswordModal = new window.bootstrap.Modal('#PasswordModal');
        PasswordPage.Page.on('click', '#SubjectiveSummaryButton', PasswordPage.OnSubjectiveSummaryButtonClick);
        PasswordPage.Page.on('keydown', '#SubjectiveSummaryButton', (e) => e.preventDefault());
        PasswordPage.Page.on('keyup', '#SubjectiveSummaryButton', PasswordPage.OnSubjectiveSummaryButtonKeyUp);
        PasswordPage.Page.on('keyup', '#PasswordInput', PasswordPage.OnPasswordInputKeyUp);
        PasswordPage.Page.on('click', '#PasswordSubmitButton', PasswordPage.OnPasswordSubmitButtonClick);
        PasswordPage.Page.on('click', '#SubjectiveConfirmButton', PasswordPage.OnSubjectiveConfirmButtonClick);
    };
}
exports.PasswordPage = PasswordPage;
//# sourceMappingURL=PasswordPage.js.map