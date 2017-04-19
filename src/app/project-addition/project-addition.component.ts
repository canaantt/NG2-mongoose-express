import { Component, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { ProjectService } from '../service/project.service';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { IRB } from '../irb';
import { IrbService } from '../service/irb.service';

@Component({
  selector: 'app-project-addition',
  templateUrl: './project-addition.component.html',
  styleUrls: ['./project-addition.component.scss'],
  providers: [ProjectService, FileService, IrbService]
})
export class ProjectAdditionComponent implements OnInit {
 newProjectForm: FormGroup;
 @Output() projects: Project[];
 fileCategories = ['clinical', 'molecular', 'metadata'];
 fileDataTypes = ['diagnosis', 'drug', 'treatment', 'mut', 'RNASeq', 'cnv'];
 file: File;

  constructor(private fb: FormBuilder,
              private projectService: ProjectService,
              private fileService: FileService,
              private irbService: IrbService
             ) { }

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
    this.fileService.create(this.newProjectForm.get('Files').value[0]).subscribe(() => this.file);
    console.log(this.file);
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
      category: new FormControl(val),
      dataType: new FormControl(val),
      path: new FormControl(val)
    });
  }
}
