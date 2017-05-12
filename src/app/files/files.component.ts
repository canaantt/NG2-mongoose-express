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
  file: any;
  category: string;
  datatype: string;
  newFileForm: FormGroup;

  private fileUploadingUrl = 'http://localhost:3000/uploads';

  constructor(private fb: FormBuilder,
              private fileService: FileService) {
    this.files = [];
   }

  ngOnInit() {
    this.fileCategories = Object.keys(this.fileMeta);
    this.newFileForm = this.fb.group({Files: this.fb.array([this.fileItem()])});
  }

  fileItem(){
    return new FormGroup({
      Category: new FormControl('clinical', Validators.required),
      DataType: new FormControl('diagnosis', Validators.required),
      file: new FormControl('', Validators.required)
    });
  }

  csvJSON(string: string) {
      var lines = string.split("\n");
      var result = [];
      var headers = lines[0].split(",");
      for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");
          for (var j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j];
          }
          result.push(obj);
      }
      return JSON.stringify(result); //JSON
  }

  fileItemPush(item: Object) {
    this.files.push(item);
    console.log(this.files);
  }

  fileSelection(event: EventTarget) {
        let self = this;
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        this.file = files[0];
        console.log(this.file);
        let reader = new FileReader();
        reader.onload = function(e) {
          var text = reader.result;
          console.log(text);
          var json = self.csvJSON(text);
          console.log(json);
        }
        reader.readAsText(this.file);
    }
}

