import { Option } from '../BackEnd/Profile'
import { Component } from './Components'

export class OAPPage implements Component
{
    private static Page: JQuery<HTMLElement>
    private static MoreModel: bootstrap.Modal

    static OnGeneralLocationSelect = function(event: JQuery.TriggeredEvent)
    {
        $('.OAPGroup').addClass('Hidden')
        const show = $(event.target).find(':selected').attr('show')
        const section = $('#' + show)
        section.find('select, input').val('').trigger('change')
        section.removeClass('Hidden')
    }

    static OnOAPSubmitButtonClick = function()
    {
        const section = $('.OAPGroup:not(.Hidden)')
        const inputs = section.find('select, input')
        const required = inputs.find('.Required')
        for(let i = 0; i < required.length; i++)
        {
            const val = required.eq(i).val()
            if(!val)
            {
                const label = required.attr('placeholder')
                window.alert(label + ' is required')
                return
            }
        }

        const getVal = (sel: string) => section.find(sel)?.val()?.toString()
        const getOption: (sel: string) => Option = (sel: string) => {
            const select = section.find(sel)
            return {
                label: select?.val()?.toString(), 
                text: select?.find(':selected')?.attr('text'),
                text2: select?.find(':selected')?.attr('text2')
            }
        }

        const specific = section.attr('id') === 'OAPMuscle' 
            ? {label: 'Muscle', text: 'muscle'}
            : getOption('.OAPSpecific')

        window.Profile.OAP.push({
            GeneralLocation: $('#GeneralLocationSelect')?.val()?.toString(),
            SpecificLocation: specific,
            OtherSpecificLocation: getVal('.OAPSpecificOther'),
            Side: getOption('.OAPSide'),
            Segment: getVal('.OAPSegment'),
            Listing: getOption('.OAPListing'),
            OtherListing: getVal('.OAPListingOther'),
            Analysis: getOption('.OAPAnalysis'),
            OtherAnalysis: getVal('.OAPAnalysisOther'),
            SCP: getOption('.OAPSCP'),
            Plan: getOption('.OAPPlan'),
            OtherPlan: getVal('.OAPPlanOther'),
            Details: getVal('.OAPDetails')
        })

        OAPPage.MoreModel.show()
        $('#OAPDoneButton').trigger('focus')
    }

    static OnDoneButtonClick = function()
    {
        const saved = window.save()
        if(saved) {
            OAPPage.MoreModel.hide()
            $('#ChargesPage').trigger('navigate')
        }
    }

    static OnDoneButtonKeyUp = function(event: JQuery.TriggeredEvent)
    {
        event.key === '+' && $('#OAPAddMoreButton').trigger('click')
    }

    static OnAddMoreButtonClick = function()
    {
        const next = window.Profile.OAP.length + 1
        $('#OAPNumber').text('#' + next)
        const select = $('#GeneralLocationSelect')
        select.val('')
        select.trigger('change')
        OAPPage.MoreModel.hide()
    }

    static OnOAPSpecificChange(event: JQuery.TriggeredEvent)
    {
        const select = $(event.target)
        const otherInput = select.parent().parent().find('.OAPSpecificOther')
        const value = select.val()?.toString()
        if(value === 'Other')
        {
            otherInput.removeClass('Hidden')
        }
        else
        {
            otherInput.addClass('Hidden')
            otherInput.val('')
        }
    }

    static OnOAPAnalysisChange(event: JQuery.TriggeredEvent)
    {
        const select = $(event.target)
        const otherInput = select.parent().parent().find('.OAPAnalysisOther')
        const value = select.val()?.toString()
        if(value === 'Other')
        {
            otherInput.removeClass('Hidden')
        }
        else
        {
            otherInput.addClass('Hidden')
            otherInput.val('')
        }
    }

    static OnOAPPlanChange(event: JQuery.TriggeredEvent)
    {
        const select = $(event.target)
        const otherInput = select.parent().parent().find('.OAPPlanOther')
        const value = select.val()?.toString()
        if(value === 'Other')
        {
            otherInput.removeClass('Hidden')
        }
        else
        {
            otherInput.addClass('Hidden')
            otherInput.val('')
        }
    }

    static OnOAPListingChange(event: JQuery.TriggeredEvent)
    {
        const select = $(event.target)
        const otherInput = select.parent().parent().find('.OAPListingOther')
        const value = select.val()?.toString()
        if(value === 'Other')
        {
            otherInput.removeClass('Hidden')
        }
        else
        {
            otherInput.addClass('Hidden')
            otherInput.val('')
        }
    }


    public static RegisterEvents = function()
    {
        OAPPage.Page = $('#OAPPage')
        OAPPage.MoreModel = new window.bootstrap.Modal('#OAPMoreModel')
        OAPPage.Page.on('change', '#GeneralLocationSelect', OAPPage.OnGeneralLocationSelect)
        OAPPage.Page.on('click', '#OAPSubmit', OAPPage.OnOAPSubmitButtonClick)
        OAPPage.Page.on('click', '#OAPAddMoreButton', OAPPage.OnAddMoreButtonClick)
        OAPPage.Page.on('click', '#OAPDoneButton', OAPPage.OnDoneButtonClick)
        OAPPage.Page.on('keyup', '#OAPDoneButton', OAPPage.OnDoneButtonKeyUp)
        OAPPage.Page.on('change', '.OAPSpecific', OAPPage.OnOAPSpecificChange)
        OAPPage.Page.on('change', '.OAPAnalysis', OAPPage.OnOAPAnalysisChange)
        OAPPage.Page.on('change', '.OAPPlan', OAPPage.OnOAPPlanChange)
        OAPPage.Page.on('change', '.OAPListing', OAPPage.OnOAPListingChange)
    }
}