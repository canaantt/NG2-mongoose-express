import { Component,  OnInit, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { FileUploader } from 'ng2-file-upload';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  providers: [FileService]
})
export class FilesComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/upload'});
  fileMeta = {'clinical': ['diagnosis', 'drug', 'treatment'],
              'molecular': ['mut', 'RNASeq', 'cnv'],
              'metadata': ['metadata'] };
  fileCategories: string[];
  fileDataTypes: string[];
  files: any[];
  private fileUploadingUrl = 'http://localhost:3000/uploads';

  constructor(private fileService: FileService) {
    this.files = [];
   }

  ngOnInit() {
    this.fileCategories = Object.keys(this.fileMeta);
  }

  // uploadedData(): Observable<Response> {
  //   return this.http.get()
  // }


  fileItemPush(item: Object) {
    this.files.push(item);
    console.log(this.files);
  }
}

