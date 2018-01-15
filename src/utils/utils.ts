import * as Moment from 'moment';

function prajnaRequestIndexHash(env: string, ISOTime: string, seed: string): string {
    let bucket: string;

    switch (seed.toLowerCase()) {
        case 'day':
            bucket = (Moment(ISOTime).dayOfYear()) + '';
            break;
        case 'week':
            bucket = (Moment(ISOTime).week()) + '';
            break;
        case 'isoweek':
            bucket = (Moment(ISOTime).isoWeek()) + '';
            break;
        case 'month':
            bucket = (Moment(ISOTime).month() + 1) + '';
            break;
        case 'quarter':
            bucket = (Moment(ISOTime).quarter()) + '';
            break;
        default:
            if (isNaN(+seed)) {
                bucket = 'unique';
            } else {
                let dayofYear: number = Moment(ISOTime).dayOfYear(); // time unit
                if (dayofYear % +seed == 0) {
                    bucket = (dayofYear / +seed) + '';
                } else {
                    bucket = (Math.floor(dayofYear / +seed) + 1) + '';
                }
            }
            break;
    };

    const hash = `prajna-${env}-${bucket}-${seed}`;
    return hash;
}

export {
    prajnaRequestIndexHash
};
