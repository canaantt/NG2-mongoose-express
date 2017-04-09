import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { File } from '../file';
import { FileService } from '../service/file.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.css']
})
export class FileDetailComponent implements OnInit{
  @Input() fileid: string;
  file: File;

  constructor(
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    console.log("The current file id is ", this.fileid);

    this.fileService.getFile(this.fileid).then(response => this.file = response);
    
  }
}

