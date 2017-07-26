import { Permission } from './permission';
import { File } from './file';

export class Project {
    _id: string;
    Name: string;
    Description: string;
    Annotations: [{key: string, value: string}];
    Private: boolean;
    DataCompliance:  {IRBNumber: string, IECNumber: string, ComplianceOption: string};
    File: {filename: string, size: number, timestamp: Date};
    Permissions: Permission[];
    Date: Date;
    Author: string;
}
