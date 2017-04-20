import { Component, NgZone, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { NgUploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  providers: [FileService]
})
export class FilesComponent implements OnInit {
  fileMeta = {'clinical': ['diagnosis', 'drug', 'treatment'],
              'molecular': ['mut', 'RNASeq', 'cnv'],
              'metadata': ['metadata'] };
  fileCategories: string[];
  fileDataTypes: string[];
  files: File[];
  file: File;
  fileForm: FormGroup;
  options: NgUploaderOptions;
  response: any;
  hasBaseDropZoneOver: boolean;

  constructor(@Inject(NgZone) private zone: NgZone,
               private fb: FormBuilder,
               private fileService: FileService) {
      this.options = new NgUploaderOptions({
        url: 'http://localhost:3000/upload',
        autoUpload: true,
        calculateSpeed: true
      });
    }

  handleUpload(data: any) {
    setTimeout(() => {
      this.zone.run(() => {
        this.response = data;
        if (data && data.response) {
          this.response = JSON.parse(data.response);
        }
      });
    });
  }

  fileOverBase(e: boolean) {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit() {
    this.fileCategories = Object.keys(this.fileMeta);
    this.fileForm = this.fb.group({Files: this.fb.array([this.fileItem('path1')])});
  }
   fileItem(val: string) {
    return new FormGroup({
      category: new FormControl('clinical'),
      dataType: new FormControl('diagnosis'),
      path: new FormControl(val)
    });
  }
}

