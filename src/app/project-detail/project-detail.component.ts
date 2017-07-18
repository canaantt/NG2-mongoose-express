import { Component, Input, Output, SimpleChanges,  AfterViewInit, OnInit, OnChanges, ViewChild} from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { IRB } from '../irb';
import { IrbService } from '../service/irb.service';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Observable} from 'rxjs/Observable';
import { Annotation } from '../annotation';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import { PermissionsComponent } from '../permissions/permissions.component';
import { FilesComponent } from '../files/files.component';
import { StateService } from '../service/state.service';
enum roles {'full-access', 'read-only'};
@Pipe({
  name: 'IrbDetailService'
})
export class IrbDetailService implements PipeTransform {
  constructor(private irbService: IrbService) {}
  transform(id: string): Observable<string> {
      return this.irbService.getIrbObjIDByIRBNumber(id)
          .map((response, err) => {
              if(err) {
                console.log(err);
                return err;
              } else {
                return  response[0].IRBTitle;
              }
          });
  }
}
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [FileService, IrbService, UserService, FormBuilder]
})
export class ProjectDetailComponent implements  OnInit, OnChanges {
  project: any;
  authenticated:boolean;
  user:any;
  id: string;
  files: any;
  irb: any;
  pi: any;
  users$: Observable<any>;
  results$: Observable<any>;
  newAnnotationForm: FormGroup;
  @ViewChild(PermissionsComponent) permissionComponent: PermissionsComponent;
  @ViewChild(FilesComponent) filesComponent: FilesComponent;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private fileService: FileService,
    private irbService: IrbService,
    private userService: UserService,
    private stateService: StateService,
    private fb: FormBuilder) {
      this.id = this.route.snapshot.params['id'];
      this.stateService.authenticated.subscribe(res => this.authenticated = res);
      this.stateService.user.subscribe(res => this.user = res);
     }

  ngOnInit(): void {
    this.newAnnotationForm = this.fb.group({Annotations: this.fb.array([this.annotationItem('')])});
    this.projectService.getProjectByID(this.route.snapshot.params['id'])
                         .subscribe(res0 => {
                           this.project = res0;
                         });
  }

  ngOnChanges(): void {
    this.refresh();
  }
  refresh() {
    console.log('project is being refreshed...');
    console.log(this.id);
    // if (typeof(this.id) !== 'undefined') {
      this.projectService.getProjectByID(this.route.snapshot.params['id'])
                         .subscribe(res0 => {
                          //  this.project = res0;
                           this.filesComponent.filerefresh();
                          });
  }
  annotationItem(val: string) {
    return new FormGroup({
      key: new FormControl(val, Validators.required),
      value: new FormControl(val, Validators.required)
    });
  }

  update(project: Project): void {
    this.projectService.update(project).subscribe(() => {
      console.log('updating...');
      this.refresh();
    });
  }

  submitAnnotations(): void {
    this.newAnnotationForm.get('Annotations').value.forEach(element => {
      this.project.Annotations.push(element);
    });
    this.newAnnotationForm.get('Annotations').value = null;
  }
  someMethod(event) {
    console.log('event is triggered in parent');
    console.log(event);
    console.log(this.project);
    this.update(this.project);
  }

}

