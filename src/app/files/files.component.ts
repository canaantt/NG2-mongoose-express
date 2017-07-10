import { Component,  OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { FileUploader } from 'ng2-file-upload';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';
@Pipe({
  name: 'Overlapping'
})
export class Overlapping implements PipeTransform {
  constructor() {}
  transform(arr1, arr2): any {
      let overlapped = _.intersection(arr1, arr2);
      // console.log(overlapped);
      return overlapped.length/arr1.length*100;
      // return {'overlapped': overlapped.length/arr1.length,
      //         'different': _.difference(arr1, overlapped)};
  }
}
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  providers: [FileService]
})
export class FilesComponent implements OnInit {
  // public uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/upload'});
  public uploader: FileUploader;
  fileMeta = {'clinical': ['diagnosis', 'drug', 'treatment'],
              'molecular': ['mut', 'RNASeq', 'cnv', 'protein'],
              'metadata': ['metadata'] };
  fileCategories: string[];
  fileDataTypes: string[];
  files$: Observable<any>;
  category: string;
  datatype: string;
  id: string;
  uploaded: string = 'Not Uploaded';
  uploadSummaryClinical: any;
  uploadSummaryMolecular: any;
  allSamplesUploaded: any;
  allPatientsUploaded: any;

  @Input() project: any;

  constructor(private fb: FormBuilder,
              private fileService: FileService) {
   }

  ngOnInit(): void {
    console.log("Within file component...");
    this.id = this.project._id;
    this.uploader = new FileUploader({url: 'http://localhost:3000/upload/' + this.id });
    this.getFiles(this.id);
    this.fileService.checkHugoGene(this.id + '_uploadingSummary')
        .subscribe(res => {
          this.uploadSummaryClinical = res[0].filter(function(m){return 'patients' in m; });
          this.uploadSummaryMolecular = res[0].filter(function(m){return 'markers' in m; });
          let meta: any = res[0].filter(function(m) {return m.meta })[0];
          this.allSamplesUploaded = meta.allSampleIDs;
          this.allPatientsUploaded = meta.allPatientIDs;
        });
  }

  updateStatus(fileitem: any) {
    // this.fileService.sendProjectID(this.id);
    this.uploaded = 'Uploaded';
    // this.project.file = fileitem;
    // console.log(Date());
    // console.log(fileitem.file);
    // this.project.File = {'fileitem': fileitem.name,
    //                      'size': fileitem.size,
    //                      'timestamp': Date()};
  }

  getFiles(id: string) {
    this.files$ = this.fileService.getFilesByProjectID(id);
  }

  removeAllFiles() {
    this.files$ = null;
    this.fileService.removeFilesByProjectID(this.id);
    this.getFiles(this.id);
  }
}

