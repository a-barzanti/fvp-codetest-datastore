import {FixedTimeRange} from "../../src/DataFetcher/FixedTimeRange";
import {expect, assert} from "chai";

describe("Fixed Time Range Built From Valid Timestamp String", () => {
    it("should build a Fixed Time Range with a gap of a fixed number hours", () => {
        const timeRange: FixedTimeRange = new FixedTimeRange("1558634400");
        expect(timeRange.getFromTimestampInSeconds()).to.equal(1558634400);
        const diff: number = timeRange.getToTimestampInSeconds() - timeRange.getFromTimestampInSeconds();
        console.log(timeRange.getToTimestampInSeconds());
        const secondsInGap = 60 * 60 * timeRange.getHourGap();
        expect(diff).to.equal(secondsInGap);
    });
    it("should throw an exception on invalid timestamp", () => {
        assert.throw(() => new FixedTimeRange("1550637900"), Error, "Invalid timestamp");
    });
});
