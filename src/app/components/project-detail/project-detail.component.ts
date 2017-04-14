import { Component, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { IRB } from '../irb';
import { IrbService } from '../service/irb.service';
import { User } from '../user';
import { UserService } from '../service/user.service';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [FileService, IrbService, UserService]
})
export class ProjectDetailComponent implements OnInit, OnChanges {
  @Input() project: Project;
  files: any;
  irb$: any;
  pi: any;
  users$: Observable<any>;
  results$: Observable<any>;

  constructor(
    private projectService: ProjectService,
    private fileService: FileService,
    private irbService: IrbService,
    private userService: UserService) { }
  ngOnInit(): void {
    console.log('In the project detail OnInit function');
  }

  ngOnChanges() {
    if (typeof(this.project) !== 'undefined') {
      this.results$ = this.fileService.getFilesByIDs(this.project.Files);
      this.irbService.getIrbsByProjID(this.project.IRB).subscribe(res => {
        this.irb$ = res[0];
        this.userService.getUsersByID(this.irb$.PI)
        .subscribe(res2 => this.pi = res2[0]);
        this.users$ = this.userService.getUsersByIDs(this.irb$.OtherUsers);
      });
    }
  }
  
  update(project: Project): void {
    this.projectService.update(project).subscribe(() => console.log('updating...'));
  }
}
