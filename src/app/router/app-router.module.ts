import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../components/users/users.component';
import { LandingComponent } from '../components/landing/landing.component';
import { DocumentationComponent } from '../components/documentation/documentation.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { IRBComponent } from '../components/irb/irb.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }, {
    path: 'landing',
    component: LandingComponent
  }, {
    path: 'users',
    component: UsersComponent
  }, {
    path: 'documentation',
    component: DocumentationComponent
  }, {
    path: 'projects',
    component: ProjectsComponent
  }, {
    path: 'navbar',
    component: NavbarComponent
  }, {
    path: 'irb',
    component: IRBComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
