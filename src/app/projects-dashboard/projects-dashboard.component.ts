import { Component, OnInit, Input, Output } from '@angular/core';
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

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss'],
  providers: [IrbService, UserService, PermissionService, FileService, StateService]
})
export class ProjectsDashboardComponent implements OnInit {
  projects: Project[];
  selectedProject: Project;
  newProjectForm: FormGroup;
  user: any;
  userID: any;

  constructor( private fb: FormBuilder,
               private projectService: ProjectService,
               private permissionService: PermissionService,
               private irbService: IrbService,
               private fileService: FileService,
               private userService: UserService,
               private stateService: StateService ) {}

  onSelect(Project: Project): void {
    this.selectedProject = Project;
    console.log(this.selectedProject.Name);
  }
  getProjects(): void {
    this.projectService.getProjects()
      .subscribe(res => {
        const projectArr = res.json();
        projectArr.forEach(p => {
          this.irbService.getIrbsByProjID(p.IRB)
            .subscribe(res => {
              if (typeof (res[0]) !== 'undefined') {
                p.irbNumber = res[0].IRBNumber;
                this.userService.getUsersByIDs(res[0].OtherUsers)
                  .subscribe(res => p.users = res);
              }

            });
        });
        this.projects = projectArr.reverse();
      });
  }
  delete(project: Project): void {
    alert('Are you sure you would like to delete the entire dataset?');
    this.projectService.delete(project).subscribe(() => this.getProjects());
    this.fileService.removeFilesByProjectID(project._id);
    this.permissionService.removePermisionsByProjectID(project._id);
  }
  add(): void {
    this.newProjectForm = this.fb.group({
      Name: new FormControl('Name Your New Dataset', Validators.required),
      Description: new FormControl('The largest recorded snowflake was in MT during year 1887, 15 inches wide', Validators.minLength(4)),
      Private: new FormControl(true)
    });
    this.projectService.create(this.newProjectForm.value).subscribe(() => this.getProjects());
  }
  ngOnInit() {
    this.getProjects();
  }
}
