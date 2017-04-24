enum categories {'clinical', 'molecular', 'metadata'};
enum datatypes {'diagnosis', 'drug', 'treatment', 'mut', 'RNASeq', 'cnv'};

export class File {
    _id: string;
    Name: string;
    Category: categories;
    DataType: datatypes ;
    Status: string;
    Date: Date;
}
