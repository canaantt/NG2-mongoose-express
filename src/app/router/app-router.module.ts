import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { LandingComponent } from '../landing/landing.component';
import { DocumentationComponent } from '../documentation/documentation.component';
import { ProjectsComponent } from '../projects/projects.component';
import { IrbComponent } from '../irb/irb.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProjectsDashboardComponent } from '../projects-dashboard/projects-dashboard.component';
import { ProjectAdditionComponent } from '../project-addition/project-addition.component';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }, {
    path: 'landing',
    component: LandingComponent
  }, {
    path: 'navbar',
    component: NavbarComponent
  }, {
    path: 'users',
    component: UsersComponent
  }, {
    path: 'documentation',
    component: DocumentationComponent
  }, {
    path: 'projects',
    component: ProjectsComponent,
    children: [
      { path: 'dashboard', component: ProjectsDashboardComponent },
      { path: 'add', component: ProjectAdditionComponent},
      { path: ':id', component: ProjectDetailComponent }
    ]
  }, {
    path: 'irb',
    component: IrbComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
