import {DynamoDB, AWSError} from "aws-sdk";
import {FixedTimeRange} from "./FixedTimeRange";

export interface IDataFetcher {
    fetchSchedules(timeRange: FixedTimeRange): Promise<DynamoDB.QueryOutput>;
}

/**
 * This class provides functions to fetch data from Dynamo.
 */
export class DynamoDBDataFetcher implements IDataFetcher {

    private client: DynamoDB;
    private tableName: string = process.env.tableName || "fvc-mds-storage-table";

    constructor(db: DynamoDB) {
        this.client = db;
    }

    public fetchSchedules(timeRange: FixedTimeRange): Promise<DynamoDB.Types.QueryOutput>  {
        return new Promise((resolve, reject) => {
            const params: DynamoDB.Types.QueryInput = {
                ExpressionAttributeValues: {
                    ":bucket": {N: "1"},
                    ":timeFrom": {S: timeRange.getFromTimestampInSeconds().toString()},
                    ":timeTo": {S: timeRange.getToTimestampInSeconds().toString()},
                },
                TableName: this.tableName,
                IndexName: "GS4",
                KeyConditionExpression: "gsiBucket = :bucket AND gsi4sk BETWEEN :timeFrom AND :timeTo",
            };
            this.client.query(params, (err: AWSError, data: DynamoDB.Types.QueryOutput) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}
