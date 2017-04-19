import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '../file';
import { FileService } from '../service/file.service';

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

  constructor( private fb: FormBuilder,
               private fileService: FileService ) { }

  ngOnInit() {
    this.fileCategories = Object.keys(this.fileMeta);
    this.fileForm = this.fb.group({Files: this.fb.array([this.fileItem('path1')])});
    //this.fileDataTypes = this.fileMeta[this.fileForm.get('Files').value()]
  }
   fileItem(val: string) {
    return new FormGroup({
      category: new FormControl('clinical'),
      dataType: new FormControl('diagnosis'),
      path: new FormControl(val)
    });
  }
}

