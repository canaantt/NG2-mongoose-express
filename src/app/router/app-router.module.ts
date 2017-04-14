import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { LandingComponent } from '../landing/landing.component';
import { DocumentationComponent } from '../documentation/documentation.component';
import { ProjectsComponent } from '../projects/projects.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
