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

  fileSelection(event: EventTarget, projectID: string): any {
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
          if(files[0].type === 'text/csv'){
            json = JSON.parse(self.csvJSON(text));
          } else {
            json = JSON.parse(self.tsvJSON(text));
          }
          // Obj.sampleMap = json.map(function(v){ return v.sample; });
          // Obj.molecular = Object.keys(json[0]).reduce(function(p, c){
          //     if (c !== 'sample') { p.push({marker: c}); }
          //     return p;
          // }, []).map(function(molec){
          //   molec.data = this.map(function(v){ return v[molec.marker]; });
          //   return molec;
          // }, json);

          Obj.sampleMap = _.without(json.map(function(m){return Object.keys(m); })
                              .reduce(function(a, b){return _.uniq(a.concat(b)); }), 'sample');
          Obj.molecular = json.map(function(v){ return v.sample; })
                              .reduce(function(p, c){
                                p.push({marker: c});
                                return p;
                              }, [])
                              .map(function(molec){ 
                                molec.data = _.values(_.omit(this.filter(function(v){return v.sample === molec.marker; })[0], 'sample'));
                                    return molec;
                                  }, json);
          Obj.clinical = json.map(function(v){ return v.sample; })
                              .reduce(function(p, c){
                                p.push({marker: c});
                                return p;
                              }, [])
                              .map(function(molec){ 
                                molec.data = _.values(_.omit(this.filter(function(v){return v.sample === molec.marker; })[0], 'sample'));
                                    return molec;
                                  }, json);                        
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
        // console.log(element.Category);
        console.dir(this.data[0].data);
        let obj = Object();
        obj.Category = element.Category;
        obj.DataType = element.DataType;
        obj.SampleMap = {samples:this.data[0].sampleMap};
        obj.Molecular = this.data[0].molecular.map(function(v){ v.type = obj.Category; return v; });
        // obj.Clinical = this.data[0].clinical.map(function(v){ v.type = obj.Category; return v; });
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

