import { Component, Input, Output,  OnInit, SimpleChanges } from '@angular/core';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { File } from '../file';
import { FileService } from '../service/file.service';
// import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'], 
  providers: [FileService]
})
export class ProjectDetailComponent implements OnInit {
  @Input() project: Project;
  @Output() files: File[];

  constructor(
    private projectService: ProjectService,
    private fileService: FileService) { }

 ngOnInit(): void {
   console.log(this.project);
  //  if ( 'Files' in this.project) {
  //    this.getFiles(this.project.Files);
  //  } else {
  //    return;
  //  }
 }

  getFiles(ids: string[]): any {
    this.fileService.getFiles()
    .then(response => {return response.filter(m => {return ids.indexOf(m._id) > -1; }); })
    .then(res => this.files = res);
  }
  update(project: Project): void {
    this.projectService.update(project).subscribe(() => console.log('updating...'));
  }
}
