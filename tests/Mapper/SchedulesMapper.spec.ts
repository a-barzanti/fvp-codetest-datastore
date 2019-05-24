import {mapScheduleEvents, ScheduleEvent} from "../../src/Mapper/SchedulesMapper";
import {expect} from "chai";
import { IImageType } from "../../src/Datastore/IMdsTypes";
import { DynamoDB } from "aws-sdk";
import { AnyARecord } from "dns";

describe('Schedules Mapper Maps query results correctly', () => {
    it('should build a compliant Schedule Event object', function () {
        const expectedObject:ScheduleEvent[] = [
            {
                "program_id": "crid://www.example.tv/V3H8BE8",
                "titles": [
                    "Clutter & Red Flag Compilation"
                ],
                "launchUrls": [
                    {
                        "href": "http://www.example.com/vp/dtt/service/linear/8500",
                        "contentType": ""
                    }
                ],
                "images": [
                    {
                        "type": IImageType.Default,
                        "key": "http://edna.example.com/example/assets/images/default/example/1920x1080.jpg"
                    }
                ],
                "startTime": "2019-02-20T04:45:00.000Z",
                "endTime": "2019-02-20T04:45:00.000Z"
            },
            {
                "program_id": "crid://www.example.tv/V3H8BE8",
                "titles": [
                    "Clutter & Red Flag Compilation"
                ],
                "launchUrls": [
                    {
                        "href": "http://www.example.com/vp/dtt/service/linear/17728",
                        "contentType": ""
                    }
                ],
                "images": [
                    {
                        "type": IImageType.Default,
                        "key": "http://edna.example.com/example/assets/images/default/example/1920x1080.jpg"
                    }
                ],
                "startTime": "2019-02-20T04:45:00.000Z",
                "endTime": "2019-02-20T04:45:00.000Z"
            }
        ];
        const querySampleUnmarshalled = [
            {
                "gsiBucket": 1,
                "gsi2sk": "http://edna.example.com/example/assets/images/default/example/1920x1080.jpg",
                "startTime": 1550637900,
                "gsi3sk": "crid://www.example.tv/brand/3271776213#crid://www.example.tv/series/21034#crid://www.example.tv/programme/21034/C5210340016",
                "endTime": 1550639400,
                "crids": {
                    "DVB": "dvb://233a..2134;C62A",
                    "TVA": "crid://www.example.tv/V3H8BE8"
                },
                "sk": "BCAST_0a03_TVA",
                "titles": {
                    "LONG": "Clutter & Red Flag Compilation"
                },
                "pk": "dvb://233a..2134;C62A",
                "gsi1pk": "http://www.example.com/vp/dtt/service/linear/8500",
                "gsi4sk": "1550637900",
                "gsi5sk": "1550639400"
            }, {
                "gsiBucket": 1,
                "gsi2sk": "http://edna.example.com/example/assets/images/default/example/1920x1080.jpg",
                "startTime": 1550637900,
                "gsi3sk": "crid://www.example.tv/brand/3271776213#crid://www.example.tv/series/21034#crid://www.example.tv/programme/21034/C5210340016",
                "endTime": 1550639400,
                "crids": {
                    "DVB": "dvb://233a..4540;C62A",
                    "TVA": "crid://www.example.tv/V3H8BE8"
                },
                "sk": "BCAST_0a03_TVA",
                "titles": {
                    "LONG": "Clutter & Red Flag Compilation"
                },
                "pk": "dvb://233a..4540;C62A",
                "gsi1pk": "http://www.example.com/vp/dtt/service/linear/17728",
                "gsi4sk": "1550637900",
                "gsi5sk": "1550639400"
            }
        ];
        const querySample:DynamoDB.AttributeMap[] = querySampleUnmarshalled.map(function (querySampleElement:any):DynamoDB.AttributeMap {
            return DynamoDB.Converter.marshall(querySampleElement);
        });
        const mappedQuery:ScheduleEvent[] = querySample.map(mapScheduleEvents);
        expect(JSON.stringify(mappedQuery)).to.equal(JSON.stringify(expectedObject));
    });
});
