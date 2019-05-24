import {DynamoDB} from "aws-sdk";
import AWS from "aws-sdk";
import {APIGatewayProxyEvent, Callback, Context} from "aws-lambda";

import {DynamoDBDataFetcher} from "../DataFetcher/DataFetcher";
import { FixedTimeRange } from "../DataFetcher/FixedTimeRange";
import { mapScheduleEvents } from "../Mapper/SchedulesMapper";

export class Api {
    private dataFetcher: DynamoDBDataFetcher;

    constructor(db: AWS.DynamoDB) {
        this.dataFetcher = new DynamoDBDataFetcher(db);
    }

    public onHttpGetSchedules(event: APIGatewayProxyEvent, context: Context, callback: Callback): void {
        let startTime:string = "";
        let fixedTimeRange: FixedTimeRange;
        if (event.queryStringParameters) {
            startTime = event.queryStringParameters.start_time;
        }
        if (+startTime < 0) {
            callback(undefined, {
                statusCode: 400,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({error: 'start_time parameter is required and should be a timestamp'})
            });
            return;
        }
        try {
            fixedTimeRange = new FixedTimeRange(startTime);
        } catch(err) {
            callback(undefined, {
                statusCode: 400,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({error: err.message})
            });
            return;
        }

        let data = this.dataFetcher
            .fetchSchedules(fixedTimeRange)
            .then((data:DynamoDB.QueryOutput) => {
                if (!data.Items) {
                    callback(undefined, {
                        statusCode: 500,
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({error: "DynamoDB Error"})
                    });
                    return;
                }
                callback(undefined, {
                    statusCode: 200,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data.Items.map(mapScheduleEvents))
                })
            })
            .catch((err: Error) => {
                callback(undefined, {
                    statusCode: 500,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({error: err})
                });
            });
    }
}
