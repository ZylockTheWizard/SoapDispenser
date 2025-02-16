"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileParser = void 0;
const moment_1 = __importDefault(require("moment"));
function Other(other, item) {
    return !!other ? `"${other}"` : item;
}
class ProfileParser {
    static Header(profile) {
        const dob = (0, moment_1.default)(profile.DOB).format('MM/DD/YYYY');
        const header = [
            `Patient: ${profile.FirstName} ${profile.LastName}`,
            `Patient DOB: ${dob}`,
            ''
        ];
        return header;
    }
    static FullSubjectiveNote(profile) {
        const sn = ['S:'];
        sn.push(profile.Subjective.map((s, i) => {
            const sLocation = Other(s.OtherLocation, s.SpecificLocation.text);
            const sQuality = Other(s.OtherQuality, s.Quality.text);
            const sSide = s.Side.text;
            const sSeverity = [
                !!s.OtherSeverity ? `described as "${s.OtherSeverity}"` : '',
                !!s.Severity ? `rated as ${s.Severity}/10` : ''
            ].filter(s => s).join(', ');
            const sLocationText = s.IsExtremity
                ? `of their ${sSide} ${sLocation}`
                : `${sSide} of their ${sLocation}`;
            const complaint = (!sQuality ? sLocation : `${sQuality} ${sLocationText}`) + ' ' + sSeverity;
            return i === 0
                ? `${profile.FirstName} presented today with ${complaint}.`
                : `${profile.FirstName} also noted ${complaint}.`;
        }).join(' '));
        return sn;
    }
    static ShortSubjectiveNote(profile) {
        const ssn = ['S:'];
        profile.Subjective.forEach(s => {
            const ssLocation = Other(s.OtherLocation, s.SpecificLocation.label);
            const ssQuality = Other(s.OtherQuality, s.Quality.label);
            const ssSide = s.Side.label;
            const ssSeverity = [
                !!s.OtherSeverity ? `"${s.OtherSeverity}"` : '',
                !!s.Severity ? `${s.Severity}/10` : ''
            ].filter(s => s).join(', ');
            const simple = (!ssQuality ? ssLocation : `${ssLocation}, ${ssSide}, ${ssQuality}`) + ', ' + ssSeverity;
            ssn.push(simple);
        });
        return ssn;
    }
    static ShortOAPNote(profile) {
        const notes = ['OAP:'];
        profile.OAP.forEach(oap => {
            const specific = Other(oap.OtherSpecificLocation, oap.SpecificLocation.label);
            const analysis = Other(oap.OtherAnalysis, oap.Analysis.label);
            const plan = Other(oap.OtherPlan, oap.Plan.label);
            const listing = Other(oap.OtherListing, oap.Listing.label);
            const side = oap.Side.label !== 'N/A' ? oap.Side.label : '';
            const o = [specific, side, oap.Segment].filter(o => o).join(' ');
            notes.push(`${o}, ${listing}`);
            notes.push(`${analysis}, ${oap.SCP.label}, ${plan}`);
            !!oap.Details && notes.push(`"${oap.Details}"`);
            notes.push('');
        });
        return notes;
    }
    static FullOAPNote(profile) {
        const sn = [];
        profile.OAP.forEach(oap => {
            if (oap.GeneralLocation === 'Other') {
                sn.push('OAP:');
                sn.push(`"${oap.Details}"`);
            }
            else {
                const analysis = Other(oap.OtherAnalysis, oap.Analysis.text);
                const location = Other(oap.OtherSpecificLocation, oap.SpecificLocation.text);
                const alocation = Other(oap.OtherSpecificLocation, oap.SpecificLocation.text2)?.replace('[Segment]', oap.Segment);
                const alocationUpper = alocation?.charAt(0).toUpperCase().concat(alocation?.slice(1));
                let listing = '';
                if (!!oap.OtherListing)
                    listing = `"${oap.OtherListing}"`;
                else if (!!oap.Listing.text)
                    listing = oap.Listing.text;
                else
                    listing = oap.Listing.label;
                let scp = '';
                if (!!oap.SCP.text)
                    scp = oap.SCP.text;
                else
                    scp = oap.SCP.label;
                const plan = Other(oap.OtherPlan, oap.Plan.text);
                sn.push('O: '.concat(oap.GeneralLocation === 'Spine'
                    ? `${analysis} ${location}`
                    : [`${analysis} the`, oap.Side.text, oap.Segment].filter(s => s).join(' ')));
                sn.push('A: '.concat(oap.GeneralLocation === 'Spine'
                    ? `Findings indicated ${listing} ${alocation}`
                    : [`Findings indicated ${listing} of the`, oap.Side.text, oap.Segment].filter(s => s).join(' ')));
                sn.push('P: '.concat(oap.GeneralLocation === 'Spine'
                    ? `${alocationUpper} was addressed utilizing ${plan} contacting ${scp}`
                    : [`The`, oap.Side.text, `${oap.Segment} was addressed utilizing ${plan} contacting the ${scp}`].filter(s => s).join(' ')));
                if (!!oap.Details) {
                    sn.push(`Details: "${oap.Details}"`);
                }
            }
            sn.push('');
        });
        return sn;
    }
}
exports.ProfileParser = ProfileParser;
//# sourceMappingURL=Profile.js.map