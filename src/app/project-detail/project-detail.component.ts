import { Component, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { Permission } from '../permission';
import { PermissionService } from '../service/permission.service';
import { IRB } from '../irb';
import { IrbService } from '../service/irb.service';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [FileService, IrbService, UserService, PermissionService, FormBuilder]
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  id: string;
  files: any;
  irb$: any;
  pi: any;
  users$: Observable<any>;
  results$: Observable<any>;
  permissions: Permission[];
  newPermissionForm: FormGroup; 
  roles = ['full-access', 'read-only'];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private fileService: FileService,
    private irbService: IrbService,
    private userService: UserService,
    private permissionService: PermissionService,
    private fb: FormBuilder) {
      this.id = this.route.snapshot.params['id'];
     }
  ngOnInit(): void {
    this.newPermissionForm = this.fb.group({Permissions: this.fb.array([this.permissionItem('New Email'), this.permissionItem('New Email')])});
    if (typeof(this.id) !== 'undefined') {
      this.projectService.getProjectByID(this.route.snapshot.params['id'])
                         .subscribe(res0 => {
                           this.project = res0;
                           this.results$ = this.fileService.getFilesByIDs(this.project.Files);
                            this.irbService.getIrbsByProjID(this.project.IRB).subscribe(res => {
                              this.irb$ = res[0];
                              if(typeof(this.irb$) !== 'undefined'){
                                 this.userService.getUsersByID(this.irb$.PI)
                                                 .subscribe(res2 => this.pi = res2[0]);
                                 this.users$ = this.userService.getUsersByIDs(this.irb$.OtherUsers);
                              }
                            });
                          });
    } else {
      console.log(typeof(this.id));
    }
  }
   permissionItem(val: string) {
      return new FormGroup({
        Email: new FormControl(val, Validators.required),
        Role: new FormControl('', Validators.required)
     });
   }

  update(project: Project): void {
    this.projectService.update(project).subscribe(() => console.log('updating...'));
  }
  getPermissions(): void {
    console.log("withint getPermissions: ");
    console.log(this.id);
    this.permissionService.getPermissionsByProjectID(this.id)
                          .subscribe(res => {
                            this.permissions = res.json();
                            console.log(res.json());});
  }
  addPermission(formValue: any) {
    let p =  new Permission();
    this.userService.userValidationByEmail(formValue.get('Email'))
        .subscribe(res => {
          
        });
  }
}
