import { Component, OnInit , OnChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '../file';
import { FileService } from '../service/file.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  providers: [FileService]
})
export class FilesComponent implements OnInit, OnChanges {
  fileMeta = {'clinical': ['diagnosis', 'drug', 'treatment'], 
              'molecular': ['mut', 'RNASeq', 'cnv'], 
              'metadata': ['metadata'] };
  fileCategories = Object.keys(this.fileMeta);
  fileDataTypes: string[];
  files: File[];
  file: File;
  fileForm: FormGroup;

  constructor( private fb: FormBuilder,
               private fileService: FileService ) { }

  ngOnInit() {
    this.fileForm = this.fb.group({Files: this.fb.array([this.fileItem('path1')])});
  }  
   fileItem(val: string) {
    return new FormGroup({
      category: new FormControl('clinical'),
      dataType: new FormControl('diagnosis'),
      path: new FormControl(val)
    });
  }

  ngOnChanges() {
    this.fileDataTypes = fileMeta[this.]
  }  

}

