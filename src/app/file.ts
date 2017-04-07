enum categories {'clinical', 'molecular', 'metadata'};
enum datatypes {'diagnosis', 'drug', 'treatment', 'mut', 'RNASeq', 'cnv'};

export class File {
    _id: string;
    Category: categories;
    DataType: datatypes ;
    Path: string;
    Status: boolean;
}
