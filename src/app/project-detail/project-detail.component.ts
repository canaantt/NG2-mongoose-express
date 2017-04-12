import { Component, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'], 
  providers: [FileService]
})
export class ProjectDetailComponent implements OnInit, OnChanges {
  @Input() project: Project;
  files: any;
  results$: Observable<any>;

  constructor(
    private projectService: ProjectService,
    private fileService: FileService) { }
  ngOnInit(): void {
    console.log('In the project detail OnInit function');
  }

  ngOnChanges() {
    if (typeof(this.project) !== 'undefined') {
      this.getFilesByIDs(this.project.Files);
      this.results$ = this.fileService.getFilesByIDs(this.project.Files);
    }
  }
  getFilesByIDs(ids: string[]): any {
    console.log(this.project.Files);
    this.fileService.getFilesByIDs(this.project.Files)
    .subscribe(res => {
      this.files = res;
    });
  }
  update(project: Project): void {
    this.projectService.update(project).subscribe(() => console.log('updating...'));
  }
}
