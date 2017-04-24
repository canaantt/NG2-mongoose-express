export class Project {
    _id: string;
    Name: string;
    Description: string;
    Annotations: [{key: string, value: string}];
    Files: string[];
    IRB: string;
    Date: Date;
}
