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
  data: any[];

  private fileUploadingUrl = 'http://localhost:3000/uploads';

  constructor(private fb: FormBuilder,
              private fileService: FileService) {
    this.files = [];
    this.data = [];
   }

  ngOnInit(): void {
    this.fileCategories = Object.keys(this.fileMeta);
    this.newFileForm = this.fb.group({Files: this.fb.array([this.fileItem()])});
  }

  fileItem() {
    return new FormGroup({
      Category: new FormControl('clinical', Validators.required),
      DataType: new FormControl('diagnosis', Validators.required),
      File: new FormControl()
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

  // fileItemPush(item: Object) {
  //   this.files.push(item);
  //   console.log(this.files);
  // }

  fileSelection(event: EventTarget): any {
        let self = this;
        let json = null;
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let reader = new FileReader();
        let Obj = Object ();
        reader.readAsText(files[0]);
        reader.onload = function(e) {
          let text = reader.result;
          console.log(text);
          json = self.csvJSON(text);
          console.log(json);
          // let Obj = Object ();
          Obj.data = json;
          Obj.name = files[0].name;
          Obj.size = files[0].size;
          // console.log(Obj);
          // self.files.push(Obj);
          // console.log(self.files);
        }
        // return null;
        return Obj;
    }

    // fileItemAppend(obj: Object): void {
    //   console.log("within fileItemAppend");
    //   console.log(obj);
    //   this.data.push(obj);
    // }
    onSelection(event: EventTarget): void {
      // console.log(formValue.Category);
      var Obj = this.fileSelection(event);
      this.data.push(Obj);
      console.log(this.data);
    }

    submitFiles(): void {
      this.newFileForm.get('Files').value.forEach(element => {
        console.log(element.Category);
        let obj = Object();
        obj.Category = element.Category;
        obj.data = this.data[0];
        obj.name = this.data[0].name;
        obj.size = this.data[0].size;
        this.files.push(obj);
      });
    }

    updateFile(): void{

    }

    deleteFile(): void {
      //remove element from data[]
      //remove element from files[]
      //remove element from reactive form ?
    }
}

