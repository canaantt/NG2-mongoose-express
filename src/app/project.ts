import { Permission } from './permission';
import { File } from './file';

export class Project {
    _id: string;
    Name: string;
    Description: string;
    Annotations: [{key: string, value: string}];
    // Files: string[];
    files: Object;
    Permissions: Permission[];
    Date: Date;
}
