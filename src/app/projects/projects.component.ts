import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [ProjectService]
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  selectedProject: Project;
  newProjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

  getProjects(): void {
    this.projectService.getProjects()
       .subscribe(res => {
          this.projects = res.json();
        });
  }
  onSelect(Project: Project): void {
    this.selectedProject = Project;
  }
  delete(project: Project): void {
    this.projectService.delete(project).subscribe(() => this.getProjects());
  }
  submit() {
    this.projectService.create(this.newProjectForm.value).subscribe(() => this.getProjects());
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
