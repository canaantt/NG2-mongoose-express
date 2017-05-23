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
  files$: Observable<any>;
  id: string;
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
    this.id = this.project._id;
    this.getFiles();
  }
  getFiles(): void {
    this.files$ = this.fileService.getFilesByProjectID(this.id);
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

    onSelection(event: EventTarget, i): void {
      var Obj = this.fileSelection(event, this.project._id);
      this.data[i] = Obj;
    }

    submitFiles(): void {
      this.newFileForm.get('Files').value.forEach(element => {
        console.log(element.Category);
        let obj = Object();
        obj.Category = element.Category;
        obj.DataType = element.DataType;
        obj.Data = this.data[0].data;
        obj.Name = this.data[0].name;
        obj.Size = this.data[0].size;
        obj.Project = this.data[0].project;
        this.fileService.create(obj).subscribe(() => this.getFiles());
      });
    }

    updateFile(file: File) {
      this.fileService.update(file).subscribe(() => this.getFiles());
    }

    deleteFile(file: File) {
      this.fileService.delete(file).subscribe(() => this.getFiles());
    }
}

