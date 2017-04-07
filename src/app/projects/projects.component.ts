import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [ProjectService]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project;
  newProjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ProjectService: ProjectService
  ) {}

  getProjects(): void {
    this.ProjectService.getProjects()
      .then(Projects => this.projects = Projects);
  }
  onSelect(Project: Project): void {
    this.selectedProject = Project;
  }
  delete(project: Project): void {
    this.ProjectService.delete(project).then((value: void) => this.getProjects());
  }
  submit() {
    this.ProjectService.create(this.newProjectForm.value).then((value: any) => this.getProjects());
  }

  ngOnInit(): void {
    this.getProjects();

    this.newProjectForm = this.fb.group({
      Name: new FormControl('', Validators.required),
      Description: new FormControl('World', Validators.minLength(4))
    });
    console.log(this.newProjectForm.get('Name'));
  }
}
