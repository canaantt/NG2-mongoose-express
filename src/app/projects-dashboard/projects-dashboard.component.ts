import { Component, OnInit, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { Permission } from '../permission';
import { PermissionService } from '../service/permission.service';
import { IRB } from '../irb';
import { IrbService } from '../service/irb.service';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { FileService } from '../service/file.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { StateService } from '../service/state.service';
// @Pipe({
//   name: 'GetProjectByID'
// })
// export class GetProjectByID implements PipeTransform {
//   constructor(private projectService: ProjectService) {}
//   transform(id: string): Observable<any> {
//       return this.projectService.getProjectByID(id)
//       .map(res => {
//         this.projects
//       });
//   }
// }
@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss'],
  providers: [IrbService, UserService, PermissionService, FileService]
})
export class ProjectsDashboardComponent implements OnInit {
  projects: any[] = [];
  selectedProject: Project;
  newProjectForm: FormGroup;
  user: any;
  userID: any;
  authenticated:boolean;
  projectIDs: any;
  permissions: any;

  constructor( private fb: FormBuilder,
               private projectService: ProjectService,
               private permissionService: PermissionService,
               private irbService: IrbService,
               private fileService: FileService,
               private userService: UserService,
               private stateService: StateService) {}

  onSelect(Project: Project): void {
    this.selectedProject = Project;
    console.log(this.selectedProject.Name);
  }
  getUserID(id: string): void{
    console.log('in getting user id');
    this.userService.getUserIDByGmail(id)
              .subscribe(res => {
                console.log(res);
                this.getPermissions(res[0]._id);
                this.userID = res[0]._id;
              });
  }
  getPermissions(id: string): void {
    console.log('in getting permissions');
    this.permissionService.getPermissionsByUserID(id)
        .subscribe(res => {
          this.getProjectIDs(res);
          this.permissions = res;
          console.log("....", this.permissions);
        });
  }
  getProjectIDs(permissions: any): void {
    console.log('in getting projectIDs');
    this.projectIDs = permissions.map(function(r){return r.Project; });
    console.log('this project IDs...', this.projectIDs);
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getProjectByUserID(this.projectIDs)
        .subscribe(res => {
          this.projects.push(res);
          console.log(this.projects);
        });
  }
  // getProjects(ids: string[]): void {
  //   let projects = [];
  //   ids.forEach(function(id){
  //     this.getProjectByID(id).subscribe(res=>{
  //       projects.push(res);
  //       console.log(projects);
  //     });
  //   })
  // }
  // getProjectByID(id: string): any {
  //   console.log("in get Project by ID function");
  //   return this.projectService.getProjectByID(id);
  // }


  delete(project: Project): void {
    alert('Are you sure you would like to delete the entire dataset?');
    this.projectService.delete(project).subscribe(() => console.log('project is being removed.'));
    this.fileService.removeFilesByProjectID(project._id);
    this.permissionService.removePermisionsByProjectID(project._id);
  }
  add(): void {
    console.log('in adding new project');
    this.newProjectForm = this.fb.group({
      Name: new FormControl('Name Your New Dataset', Validators.required),
      Description: new FormControl('The largest recorded snowflake was in MT during year 1887, 15 inches wide', Validators.minLength(4)),
      Private: new FormControl(true)
    });
    this.projectService.create(this.newProjectForm.value).subscribe(() => console.log('project is being added.'));
  }
  ngOnInit() {
     this.stateService.authenticated
        .subscribe(res => {
          this.authenticated = res;
          console.log('in project dashboard');
          console.log(this.authenticated);
        });
    this.stateService.user
        .subscribe(res => {
          console.log('in project dashboard');
          console.log(res);
          this.getUserID(res.email);
          this.user = res;
          console.log(this.user.email);
        });
  }

}
