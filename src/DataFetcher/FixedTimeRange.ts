/**
 * This class works as transfer object and builds from the startDate parameter.
 * TODO: In the specification we have:
 * timestamp must be a multiple of 6 hours from 00:00 UTC e.g. 2019-03-17T09:00:00+00:00
 * but T09:00:00+00:00 is not a multiple: verify requirement and either fix the class or remove this comment
 */
export class FixedTimeRange {
    private hourGap: number = 6;
    private from: Date;
    private to: Date;

    constructor(startTime: string) {
        this.from = new Date(Number(startTime)*1000);
        if (!this.validateTimeFrom(this.from)) {
            throw Error(`Invalid timestamp: hours must be an exact multiple of ${this.hourGap}`)
        }
        this.to = new Date(( Number(startTime) + (this.hourGap*60*60))*1000 );
    }

    public getFromTimestampInSeconds(): number {
        return this.from.getTime()/1000;
    }
    
    public getToTimestampInSeconds(): number {
        return this.to.getTime()/1000;
    }

    public getHourGap(): number {
        return this.hourGap;
    }

    private validateTimeFrom(timeFrom: Date): boolean {
        return (timeFrom.getUTCHours() % this.hourGap) === 0 && timeFrom.getMinutes() === 0 && timeFrom.getSeconds() === 0;
    }
}
