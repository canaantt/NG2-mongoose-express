import { Component, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-project-addition',
  templateUrl: './project-addition.component.html',
  styleUrls: ['./project-addition.component.scss']
})
export class ProjectAdditionComponent implements OnInit {
 newProjectForm: FormGroup;
 @Output() projects: Project[];

  constructor(private fb: FormBuilder,
  private projectService: ProjectService) { }

  getProjects(): void {
    this.projectService.getProjects()
       .subscribe(res => {
          this.projects = res.json();
        });
  }
  ngOnInit(): void {
    this.newProjectForm = this.fb.group({
      Name: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.minLength(4)),
      Annotations: this.fb.array([this.annotationItem('annot1')]),
      Files: this.fb.array([this.fileItem('file1'), this.fileItem('file2')])
    });
    console.log(this.newProjectForm.get('Files'));
  }
  submit() {
    this.projectService.create(this.newProjectForm.value).subscribe(() => this.getProjects());
  }
  annotationItem(val: string) {
    return new FormGroup({
      key: new FormControl(val, Validators.required),
      value: new FormControl(val, Validators.required)
    });
  }

  fileItem(val: string) {
    return new FormGroup({
      category: new FormControl(val, Validators.required),
      dataType: new FormControl(val, Validators.required),
      path: new FormControl(val, Validators.required)
    });
  }
}
