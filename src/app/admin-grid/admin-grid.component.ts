import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { Permission } from '../permission';
import { PermissionService } from '../service/permission.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-admin-grid',
  templateUrl: './admin-grid.component.html',
  styleUrls: ['./admin-grid.component.scss'],
  providers: [UserService, ProjectService, PermissionService]
})
export class AdminGridComponent implements OnInit {
  allUsers: User[];
  allProjects: Project[];
  allPermissions: Permission[];
  grid: any[];

  constructor(private userService: UserService,
              private projectService: ProjectService,
              private permissionService: PermissionService) {}
  ngOnInit() {
    this.userService.getUsers()
        .map(res => res.json())
        .subscribe(response => this.allUsers = response);
    this.projectService.getProjects()
        .map(res => res.json())
        .subscribe(response => this.allProjects = response);
    this.permissionService.getPermissions()
        .map(res => res.json())
        .subscribe(response => {
          this.allPermissions = response;
          this.check();
        });
  }

  check = function(){
    this.join(this.allUsers, this.allPermissions, this.allProjects);
  };

  join = function(users: User[], permissions: Permission[], projects: Project[]): any {
    this.grid = permissions.map(function(v){
        let obj = Object();
        obj = v;
        const user = users.filter(function(m){
          return m._id === v.User;
        });
        if ( user.length === 1) {
          obj =  _.extend(obj, user[0]);
        }
        const proj = projects.filter(function(m){
          return m._id === v.Project;
        });
        if ( proj.length === 1) {
          obj =  _.extend(obj, proj[0]);
        }
        
        return obj;
      });
  };

}
