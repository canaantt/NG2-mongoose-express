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
      const overlapped = _.intersection(arr1, arr2);
      return overlapped.length/arr1.length * 100;
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
  files$: Observable<any>;
  id: string;
  uploadedstring = 'Not Uploaded';
  uploadStatus = {
    'uploadSummaryClinical': [],
    'uploadSummaryMolecular': [],
    'allSamplesUploaded': [],
    'allPatientsUploaded': []
  };
  @Input() project: any;
  @Output()
    uploaded: EventEmitter<string> = new EventEmitter();

  uploadComplete() {
    this.uploaded.emit('complete');
  }
  constructor(private fb: FormBuilder,
              private fileService: FileService) {
   }

  ngOnInit(): void {
    this.id = this.project._id;
    this.uploader = new FileUploader({url: 'http://localhost:3000/upload/' + this.id });
    // this.getFiles(this.id);
    this.fileService.uploadingValidation(this.id + '_uploadingSummary')
        .subscribe(res => {
          this.uploadStatus.uploadSummaryClinical = res[0].filter(function(m){return 'patients' in m; });
          this.uploadStatus.uploadSummaryMolecular = res[0].filter(function(m){return 'markers' in m; });
          const meta: any = res[0].filter(function(m) {return m.meta; })[0];
          this.uploadStatus.allSamplesUploaded = meta.allSampleIDs;
          this.uploadStatus.allPatientsUploaded = meta.allPatientIDs;
        });
  }

  updateStatus(fileitem: any) {
    // this.fileService.sendProjectID(this.id);
    console.log(fileitem);
    this.uploadedstring = 'Uploaded';
    console.log(fileitem.file);
    this.project.File = {
      'filename': fileitem.file.name,
      'size' : fileitem.file.size,
      'timestamp' : Date()
    };
    this.uploadComplete();
  }

  // getFiles(id: string) {
  //   this.files$ = this.fileService.getFilesByProjectID(id);
  // }

  removeAllFiles() {
    this.fileService.removeFilesByProjectID(this.id)
        .subscribe((err) =>{
          if (err) {console.log(err); }
          // this.getFiles(this.id);
        });
  }
}

