import { Component, Input, Output, SimpleChanges, OnInit } from '@angular/core';
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
export class ProjectDetailComponent implements OnInit{
  @Input() project: Project;
  files: File[];

  constructor(
    private projectService: ProjectService,
    private fileService: FileService) { }
  demo = ["58e7c6f85aa211165c1c4a40", "58e7c6f85aa211165c1c4a42"];

  ngOnInit(): void {
    console.log("In the project detail OnInit function");
    this.getFiles(this.demo);
  }
  getFiles(ids: string[]): any {
    console.log(ids);
    this.fileService.getFiles()
    .map(res => {
      return res.json();
    })
    .filter(res => {
      console.log('in filter');
      res.forEach(element => {
        console.log(element._id);
      });
      return ids.indexOf(res._id)> -1
    })
    .subscribe(res => {
      console.log("in subscribe");
      console.log(res);
      this.files = res;
      console.log(this.files);
    });
  }
  update(project: Project): void {
    this.projectService.update(project).subscribe(() => console.log('updating...'));
  }
}
