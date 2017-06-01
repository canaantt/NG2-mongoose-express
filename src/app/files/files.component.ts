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
    this.getFilesByProjectID('molecular');
  }
  getFilesByProjectID(dataType: string): void {
    this.files$ = this.fileService.getFilesByProjectID(this.id, 'molecular');
  }
  fileItem() {
    return new FormGroup({
      Category: new FormControl('clinical', Validators.required),
      DataType: new FormControl('diagnosis', Validators.required),
      File: new FormControl()
    });
  }

  csvJSON(string: string) {
      var lines = string.split('\n');
      var result = [];
      var headers = lines[0].split(',');
      for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(',');
          if( currentline !== undefined ){
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
                // console.log("at line ", j);
            }
          }
          result.push(obj);
      }
      return JSON.stringify(result); //JSON
  }

  tsvJSON(string: string) {
      var lines = string.split('\n');
      var result = [];
      var headers = lines[0].split('\t');
      for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split('\t');
          if( currentline !== undefined ){
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
                // console.log("at line ", j);
            }
          }
          result.push(obj);
      }
      return JSON.stringify(result); //JSON
  }

  fileSelection(event: EventTarget, projectID: string, ): any {
        let self = this;
        let json = null;
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        console.log(files[0]);
        let reader = new FileReader();
        let Obj = Object ();
        reader.readAsText(files[0]);
        reader.onload = function(e) {
          let text = reader.result;
          // if (files[0].type === 'text/csv') {
          //   json = JSON.parse(self.csvJSON(text));
          // } else {
          //   json = JSON.parse(self.tsvJSON(text));
          // }
          // Obj.data = json;
          Obj.data = text;
          Obj.name = files[0].name;
          Obj.size = files[0].size;
          Obj.type = files[0].type;
          Obj.project = projectID;
        }
        return Obj;
    }

  onSelection(event: EventTarget, i): void {
    var Obj = this.fileSelection(event, this.project._id);
    // console.log("what is i: ", i); i is always 0;
    this.data[i] = Obj;
  }

  submitFiles(): void {
    this.newFileForm.get('Files').value.forEach(element => {
      // console.log(element.Category);
      console.dir(this.data[0].data);
      let obj = Object();
      obj.Category = element.Category;
      obj.DataType = element.DataType;
      let json = this.data[0].data;
      if (element.Category === 'molecular') {
        // let sampleMap = _.without(json.map(function(m){return Object.keys(m); })
        //                       .reduce(function(a, b){return _.uniq(a.concat(b)); }), 'sample');
        // let molecular = json.map(function(v){ return v.sample; })
        //                       .reduce(function(p, c){
        //                         p.push({marker: c});
        //                         return p;
        //                       }, [])
        //                       .map(function(molec){
        //                         molec.data = _.values(_.omit(this.filter(function(v){return v.sample === molec.marker; })[0], 'sample'));
        //                             return molec;
        //                           }, json);
        let sampleMap = null;
        let molecular = json;
        obj.SampleMap_Molecular = {samples_molecular: sampleMap};
        // obj.Molecular = molecular.map(function(v){ v.type = obj.DataType; return v; });
        obj.Molecular = molecular;
      }

      if (element.Category === 'clinical') {
        let sampleMap = _.without(json.map(function(m){return Object.keys(m); })
                              .reduce(function(a, b){return _.uniq(a.concat(b)); }), 'sample');
        let clinical = json.map(function(v){ return v.sample; })
                              .reduce(function(p, c){
                                p.push({marker: c});
                                return p;
                              }, [])
                              .map(function(clinic){
                                clinic.data = _.values(_.omit(this.filter(function(v){return v.sample === clinic.marker; })[0], 'sample'));
                                    return clinic;
                                  }, json);
        obj.SampleMap_Clinical = {samples_clinical: sampleMap};
        obj.Clinical = clinical.map(function(v){ v.type = obj.DataType; return v; });
     }
      // obj.Clinical = this.data[0].clinical.map(function(v){ v.type = obj.Category; return v; });
      obj.Name = this.data[0].name;
      obj.Size = this.data[0].size;
      obj.Project = this.data[0].project;
      this.fileService.create(obj).subscribe(() => this.getFilesByProjectID("molecular"));
    });
  }

  // deleteFile(file: File) {
  //   this.fileService.delete(file).subscribe(() => this.getFilesByProjectID(obj.Project, "molecular"));
  // }
}

