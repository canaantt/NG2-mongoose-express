import { Component, Input } from '@angular/core';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent{
  @Input() project: Project;
  constructor(private projectService: ProjectService) { }

  update(project: Project): void {
    this.projectService.update(project);
    console.log("in updating");
  }
}
