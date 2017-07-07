import { Component,  OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { FileUploader } from 'ng2-file-upload';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';

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
  @Input() project: any;

  constructor(private fb: FormBuilder,
              private fileService: FileService) {
   }

  ngOnInit(): void {
    console.log("Within file component...");
    this.id = this.project._id;
    this.uploader = new FileUploader({url: 'http://localhost:3000/upload/' + this.id });
    this.getFiles(this.id);
    this.fileService.checkHugoGene(this.id, 'uploadingSummary')
        .subscribe(res => console.log(res));
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

