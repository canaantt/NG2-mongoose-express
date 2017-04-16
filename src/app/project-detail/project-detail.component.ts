import { Component, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [FileService, IrbService, UserService]
})
export class ProjectDetailComponent implements OnInit, OnChanges {
  project: any;
  id: string;
  files: any;
  irb$: any;
  pi: any;
  users$: Observable<any>;
  results$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private fileService: FileService,
    private irbService: IrbService,
    private userService: UserService) {
      this.id = this.route.snapshot.params['id'];
     }
  ngOnInit(): void {
    if (typeof(this.id) !== 'undefined') {
      this.projectService.getProjectByID(this.route.snapshot.params['id'])
                         .subscribe(res0 => {
                           this.project = res0;
                          //  console.log(this.project);
                            this.results$ = this.fileService.getFilesByIDs(this.project.Files);
                            this.irbService.getIrbsByProjID(this.project.IRB).subscribe(res => {
                              this.irb$ = res[0];
                              this.userService.getUsersByID(this.irb$.PI)
                              .subscribe(res2 => this.pi = res2[0]);
                              this.users$ = this.userService.getUsersByIDs(this.irb$.OtherUsers);
                            });
                          });
    } else {
      console.log(typeof(this.id));
    }
  }

  ngOnChanges() {
    console.log(typeof(this.project));
    this.id = this.route.snapshot.params['id'];
    this.projectService.getProjectByID(this.id)
                       .subscribe(res => {
                         console.log(res);
                         return this.project = res; });
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
