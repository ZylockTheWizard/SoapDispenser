import { ProfileParser } from '../BackEnd/Profile'
import { Component } from './Components'

export class PasswordPage implements Component
{
    private static Page: JQuery<HTMLElement>
    private static PasswordModal: bootstrap.Modal
    private static ConfirmModel: bootstrap.Modal

    static OnSubjectiveSummaryButtonClick = function()
    {
        PasswordPage.PasswordModal.show()
        $('#PasswordInput').trigger('focus')
    }

    static OnSubjectiveSummaryButtonKeyUp = function(event: JQuery.TriggeredEvent)
    {
        event.key === 'Enter' && $('#SubjectiveSummaryButton').trigger('click')
    }

    static OnPasswordInputKeyUp = function(event: JQuery.TriggeredEvent)
    {
        event.key === 'Enter' && $('#PasswordSubmitButton').trigger('click')
    }

    static OnPasswordSubmitButtonClick = function()
    {
        const input = $('#PasswordInput').val()
        if(input !== '259')
        {
            window.alert('Invalid passcode')
            return
        }

        const header = ProfileParser.Header(window.Profile)
        const ssn = ProfileParser.ShortSubjectiveNote(window.Profile)

        document.getElementById('ShortSubjective').innerHTML = header.concat(ssn).join('<br>')

        PasswordPage.PasswordModal.hide()
        PasswordPage.ConfirmModel.show()
    }

    static OnSubjectiveConfirmButtonClick = function()
    {
        window.Profile.SubjectiveAdditionalNotes = $('#SubjectiveAdditionalNotes').val().toString()
        PasswordPage.ConfirmModel.hide()
        $('#OAPPage').trigger('navigate')
    }

    public static RegisterEvents = function()
    {
        PasswordPage.Page = $('#PasswordPage')
        PasswordPage.ConfirmModel = new window.bootstrap.Modal('#SubjectiveConfirmModel')
        PasswordPage.PasswordModal = new window.bootstrap.Modal('#PasswordModal')
        PasswordPage.Page.on('click', '#SubjectiveSummaryButton', PasswordPage.OnSubjectiveSummaryButtonClick)
        PasswordPage.Page.on('keydown', '#SubjectiveSummaryButton', (e) => e.preventDefault())
        PasswordPage.Page.on('keyup', '#SubjectiveSummaryButton', PasswordPage.OnSubjectiveSummaryButtonKeyUp)
        PasswordPage.Page.on('keyup', '#PasswordInput', PasswordPage.OnPasswordInputKeyUp)
        PasswordPage.Page.on('click', '#PasswordSubmitButton', PasswordPage.OnPasswordSubmitButtonClick)
        PasswordPage.Page.on('click', '#SubjectiveConfirmButton', PasswordPage.OnSubjectiveConfirmButtonClick)
    }
}