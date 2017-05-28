import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { Permission } from '../permission';
import { PermissionService } from '../service/permission.service';

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
    console.log('All Users: ');
    console.log(this.allUsers);
    console.log('All Permissions: ');
    console.log(this.allPermissions);
    console.log('All Projects: ');
    console.log(this.allProjects);
  };

  join = function() {
    
  }
}
