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
      IRBNumber: new FormControl('')
    });
  }
  submit() {
    this.irbService.getIrbObjIDByIRBNumber(this.newProjectForm.get('IRBNumber').value)
                   .subscribe(res => {
                     let project = new Project();
                     project.Name = this.newProjectForm.get('Name').value;
                     project.Description = this.newProjectForm.get('Description').value;
                     project.IRB = res[0]._id;
                     this.projectService.create(project).subscribe(() => this.getProjects());
                    });
  }

}
