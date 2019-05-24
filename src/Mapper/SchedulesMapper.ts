import {DynamoDB} from "aws-sdk";
import { ITitle, ILaunchUrl, IImage, IImageType } from "../Datastore/IMdsTypes";

export interface ScheduleEvent {
    program_id: string,
    titles: ITitle[]
    launchUrls: ILaunchUrl[]
    images: IImage[]
    startTime: string,
    endTime: string
}

/**
 * This mapper is used to convert the AttibuteMap from the Dynamo query to the final object to be serialized.
 * Being a mapper it never fails, but relies on defaults instead, assuming that the data is reliable, if that is not
 * the case the misformed data should be filtered out either coming from the database or with a filter function in the lambda
 */
export const mapScheduleEvents = function (dynamoItem:DynamoDB.AttributeMap): ScheduleEvent {
    let databaseEntry = DynamoDB.Converter.unmarshall(dynamoItem);
    let program_id:string = "";
    if (databaseEntry.crids && databaseEntry.crids.TVA) {
        program_id = databaseEntry.crids.TVA;
    }
    let titles:ITitle[] = [];
    if (typeof databaseEntry.titles === 'object') {
        titles = Object.values(databaseEntry.titles);
    }
    let launchUrls:ILaunchUrl[] = [];
    if (databaseEntry.gsi1pk) {
        //TODO: It's unclear what the content type is supposed to be, verify
        launchUrls.push({
            href: databaseEntry.gsi1pk,
            contentType: ""
        });
    }
    let images:IImage[] = [];
    if (databaseEntry.gsi2sk) {
        images.push({
            type: IImageType.Default,
            key: databaseEntry.gsi2sk
        });
    } 
    let startTime:string = "";
    if (databaseEntry.startTime && +databaseEntry.startTime > 0) {
        startTime = new Date(Number(databaseEntry.startTime)*1000).toISOString();
    }
    let endTime:string = "";
    if (databaseEntry.endTime && +databaseEntry.endTime > 0) {
        endTime = new Date(Number(databaseEntry.startTime)*1000).toISOString();
    }
    return { program_id, titles, launchUrls, images, startTime, endTime}
}