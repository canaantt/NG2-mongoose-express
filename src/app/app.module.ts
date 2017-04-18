import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { UserService } from './service/user.service';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';
import { LandingComponent } from './landing/landing.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { AppRouterModule } from './router/app-router.module';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { IrbComponent } from './irb/irb.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsDashboardComponent } from './projects-dashboard/projects-dashboard.component';
import { ProjectAdditionComponent } from './project-addition/project-addition.component';


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
    ProjectAdditionComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
