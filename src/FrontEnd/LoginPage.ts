import { Component } from './Components'
import { speak } from './Speak'
import Inputmask from 'inputmask'

export class LoginPage implements Component
{
    private static Page: JQuery<HTMLElement>

    static OnNavigate()
    {
        speak('Welcome')
    }

    static GetValue(selector: string)
    {
        return LoginPage.Page.find(selector).val().toString().replace(/\s/g, '')
    }

    static OnStartClick()
    {
        const FirstName = LoginPage.GetValue('#FirstName')
        const LastName = LoginPage.GetValue('#LastName')
        const DOB = new Date(LoginPage.GetValue('#DOB'))

        if(!FirstName) 
        {
            window.alert('First Name cannot be empty')
            return
        }

        if(!LastName) 
        {
            window.alert('Last Name cannot be empty')
            return
        }

        if(String(DOB) === 'Invalid Date' || DOB > new Date() || DOB < new Date('01/01/1900'))
        {
            window.alert('Invalid Date of Birth')
            return
        }

        window.Profile = {FirstName, LastName, DOB, Subjective: [], OAP: []}

        $('#SubjectivePage').trigger('navigate')
    }

    public static RegisterEvents = function()
    {
        LoginPage.Page = $('#LoginPage')
        LoginPage.Page.on('navigate', LoginPage.OnNavigate)
        LoginPage.Page.on('click', '#StartButton', LoginPage.OnStartClick)
        Inputmask('99/99/9999', { 'placeholder': 'MM/DD/YYYY' }).mask('#DOB')
    }
}