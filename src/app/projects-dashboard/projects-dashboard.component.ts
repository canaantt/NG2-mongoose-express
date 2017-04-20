import { Component, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable} from 'rxjs/Observable';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { IRB } from '../irb';
import { IrbService } from '../service/irb.service';
import { User } from '../user';
import { UserService } from '../service/user.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss'],
  providers: [IrbService, UserService]
})
export class ProjectsDashboardComponent implements OnInit {
  projects: Project[];
  selectedProject: Project;

  constructor(private projectService: ProjectService,
              private irbService: IrbService,
              private userService: UserService ) { }
  onSelect(Project: Project): void {
    this.selectedProject = Project;
    console.log(this.selectedProject.Name);
  }
  getProjects(): void {
    this.projectService.getProjects()
       .subscribe(res => {
          let projectArr = res.json();
          projectArr.forEach(p => {
            this.irbService.getIrbsByProjID(p.IRB)
                .subscribe(res => {
                  p.irbNumber = res[0].IRBNumber;
                  this.userService.getUsersByID(res[0].PI)
                      .subscribe(res2 => {
                        console.log(res2[0]);
                        p.pi = res2[0].FirstName + ' ' + res2[0].LastName;
                      });
                  this.userService.getUsersByIDs(res[0].OtherUsers)
                      .subscribe(res => p.users = res);
                });
          });
          this.projects = projectArr;
          console.log(this.projects);
        });
  }
  
  delete(project: Project): void {
    this.projectService.delete(project).subscribe(() => this.getProjects());
  }

  ngOnInit() {
    this.getProjects();
  }

}
