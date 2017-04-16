import { Component, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit {
  @Output() projects: Project[];
  @Output() selectedProject: Project;

  constructor(private projectService: ProjectService) { }
  onSelect(Project: Project): void {
    this.selectedProject = Project;
  }
  getProjects(): void {
    this.projectService.getProjects()
       .subscribe(res => {
          this.projects = res.json();
        });
  }
  delete(project: Project): void {
    this.projectService.delete(project).subscribe(() => this.getProjects());
  }

  ngOnInit() {
    this.getProjects();
  }

}
