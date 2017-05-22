import { Component,  OnInit, Input, Output, EventEmitter} from '@angular/core';
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
              'molecular': ['mut', 'RNASeq', 'cnv', 'protein'],
              'metadata': ['metadata'] };
  fileCategories: string[];
  fileDataTypes: string[];
  files: any[];
  file: any;
  category: string;
  datatype: string;
  newFileForm: FormGroup;
  data: any[];
  // @Output() fileoutput: EventEmitter<Object> = new EventEmitter<Object>();
  @Input() project: any; 

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

  fileSelection(event: EventTarget, projectID: string): any {
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
          json = self.csvJSON(text);
          // let Obj = Object ();
          Obj.data = json;
          Obj.name = files[0].name;
          Obj.size = files[0].size;
          Obj.project = projectID;
        }
        return Obj;
    }

    // fileItemAppend(obj: Object): void {
    //   console.log("within fileItemAppend");
    //   console.log(obj);
    //   this.data.push(obj);
    // }
    onSelection(event: EventTarget, i): void {
      var Obj = this.fileSelection(event, this.project._id);
      this.data[i] = Obj;
    }

    submitFiles(): void {
      this.newFileForm.get('Files').value.forEach(element => {
        console.log(element.Category);
        let obj = Object();
        obj.Category = element.Category;
        obj.dataType = element.DataType;
        obj.data = this.data[0].data;
        obj.name = this.data[0].name;
        obj.size = this.data[0].size;
        obj.Project = this.data[0].project;
        this.files.push(obj);
        // this.fileoutput.emit(this.files);
        // this.project.files = this.files;
        console.log(this.files);
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

