"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectivePage = void 0;
const Speak_1 = require("./Speak");
class SubjectivePage {
    static Page;
    static MoreModel;
    static OnNavigate() {
        (0, Speak_1.speak)('Subjective');
    }
    static OnDepthChange = function (event) {
        const depth = Number(event.target.getAttribute('depth'));
        const elements = $('[depth]').filter((_, e) => {
            return Number(e.getAttribute('depth')) > depth;
        });
        elements.val('');
        elements.trigger('change');
        elements.addClass('Hidden');
    };
    static OnLocationSelectChange = function (event) {
        const show = $(event.target).find(':selected').attr('show');
        $('#' + show).removeClass('Hidden');
    };
    static OnSpecificLocationSelectChange = function (event) {
        const show = ['#SeverityInput, #OtherSeverity'];
        const select = $(event.target);
        const id = select.attr('id');
        const val = select.val();
        if (val === 'Other') {
            show.push('#OtherLocationInput');
        }
        if (id !== 'SystemicSelect' && val !== 'Dizziness/Vertigo' && val !== 'Headache') {
            show.push('#QualitySelect');
            id === 'UpperExtremitySelect' || id === 'LowerExtremitySelect'
                ? show.push('#ExtremitySideSelect')
                : show.push('#SideSelect');
        }
        $(show.join()).removeClass('Hidden');
    };
    static OnQualitySelectChange = function (event) {
        if ($(event.target).val() === 'Other') {
            $('#OtherQualityInput').removeClass('Hidden');
        }
    };
    static GetOption = function (selector) {
        const select = $(selector);
        return {
            label: select.val()?.toString(),
            text: select.find(':selected').attr('text')
        };
    };
    static OnSubjectiveSubmitButtonClick = function () {
        const required = SubjectivePage.Page.find('.Required');
        const empty = required.filter((_, e) => !$(e).hasClass('Hidden') && !$(e).val());
        if (empty.length > 0) {
            window.alert('Please fill all boxes shown.');
            return;
        }
        const Severity = $('#SeverityInput').val()?.toString();
        const OtherSeverity = $('#OtherSeverity').val()?.toString();
        if (!Severity && !OtherSeverity) {
            window.alert('Please choose a severity or give details describing the sensation.');
            return;
        }
        const side = !!$('#ExtremitySideSelect').val()
            ? SubjectivePage.GetOption('#ExtremitySideSelect')
            : SubjectivePage.GetOption('#SideSelect');
        window.Profile.Subjective.push({
            GeneralLocation: $('#LocationSelect').val()?.toString(),
            SpecificLocation: SubjectivePage.GetOption('.SpecificLocationSelect:not(.Hidden)'),
            OtherLocation: $('#OtherLocationInput').val()?.toString(),
            IsExtremity: !($("#UpperExtremitySelect").hasClass('Hidden') && $("#LowerExtremitySelect").hasClass('Hidden')),
            Side: side,
            Quality: SubjectivePage.GetOption('#QualitySelect'),
            OtherQuality: $('#OtherQualityInput').val()?.toString(),
            Severity,
            OtherSeverity
        });
        SubjectivePage.MoreModel.show();
        $('#DoneButton').trigger('focus');
    };
    static OnAddMoreButtonClick = function () {
        const next = window.Profile.Subjective.length + 1;
        $('#SubjectiveNumber').text('#' + next);
        const select = $('#LocationSelect');
        select.val('');
        select.trigger('change');
        SubjectivePage.MoreModel.hide();
    };
    static OnDoneButtonClick = function () {
        SubjectivePage.MoreModel.hide();
        $('#PasswordPage').trigger('navigate');
    };
    static OnDoneButtonKeyUp = function (event) {
        event.key === '+' && $('#AddMoreButton').trigger('click');
    };
    static RegisterEvents = function () {
        SubjectivePage.Page = $('#SubjectivePage');
        SubjectivePage.MoreModel = new window.bootstrap.Modal('#MoreModel');
        SubjectivePage.Page.on('navigate', SubjectivePage.OnNavigate);
        SubjectivePage.Page.on('change', 'select[depth]', SubjectivePage.OnDepthChange);
        SubjectivePage.Page.on('change', '#LocationSelect', SubjectivePage.OnLocationSelectChange);
        SubjectivePage.Page.on('change', '.SpecificLocationSelect', SubjectivePage.OnSpecificLocationSelectChange);
        SubjectivePage.Page.on('change', '#QualitySelect', SubjectivePage.OnQualitySelectChange);
        SubjectivePage.Page.on('click', '#SubjectiveSubmitButton', SubjectivePage.OnSubjectiveSubmitButtonClick);
        SubjectivePage.Page.on('click', '#AddMoreButton', SubjectivePage.OnAddMoreButtonClick);
        SubjectivePage.Page.on('click', '#DoneButton', SubjectivePage.OnDoneButtonClick);
        SubjectivePage.Page.on('keyup', '#DoneButton', SubjectivePage.OnDoneButtonKeyUp);
    };
}
exports.SubjectivePage = SubjectivePage;
//# sourceMappingURL=SubjectivePage.js.map