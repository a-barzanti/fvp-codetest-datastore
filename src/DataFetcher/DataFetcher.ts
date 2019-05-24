import {DynamoDB} from "aws-sdk";
import { FixedTimeRange } from "./FixedTimeRange";

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

    public fetchSchedules(timeRange: FixedTimeRange) {
        return new Promise((resolve, reject) => {
            let params = {
                ExpressionAttributeValues: {
                    ':bucket': {N: '1'},
                    ':timeFrom' : {S: timeRange.getFromTimestampInSeconds().toString()},
                    ':timeTo' : {S: timeRange.getToTimestampInSeconds().toString()}
                },
                TableName: this.tableName,
                IndexName: 'GS4',
                KeyConditionExpression: 'gsiBucket = :bucket AND gsi4sk BETWEEN :timeFrom AND :timeTo',
            };
            this.client.query(params, function(err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}
