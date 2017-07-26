import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import { UserService } from './service/user.service';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';
import { LandingComponent } from './landing/landing.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { AppRouterModule } from './router/app-router.module';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent, IrbDetailService} from './project-detail/project-detail.component';
import { IrbComponent } from './irb/irb.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsDashboardComponent } from './projects-dashboard/projects-dashboard.component';
import { FilesComponent, Overlapping } from './files/files.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { PermissionsComponent, UserFullNamePipe } from './permissions/permissions.component';
import { AnnotationsComponent } from './annotations/annotations.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGridComponent } from './admin-grid/admin-grid.component';
import { RegisterComponent } from './register/register.component';
import { StateService } from './service/state.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import * as hello from 'hellojs';
import * as _ from 'underscore';
import { ConsentComponent } from './consent/consent.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDetailComponent,
    UsersComponent,
    LandingComponent,
    DocumentationComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    IrbComponent,
    NavbarComponent,
    ProjectsDashboardComponent,
    FilesComponent,
    FileSelectDirective,
    PermissionsComponent,
    AnnotationsComponent,
    UserFullNamePipe,
    IrbDetailService,
    AdminComponent,
    AdminGridComponent,
    RegisterComponent,
    Overlapping,
    ConsentComponent,
    LoginComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule
  ],
  providers: [UserService,
              StateService],
  bootstrap: [AppComponent ]
})
export class AppModule { }

