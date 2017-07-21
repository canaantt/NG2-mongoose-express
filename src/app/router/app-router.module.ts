import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ResolveData } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { LandingComponent } from '../landing/landing.component';
import { DocumentationComponent } from '../documentation/documentation.component';
import { ProjectsComponent } from '../projects/projects.component';
import { IrbComponent } from '../irb/irb.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProjectsDashboardComponent } from '../projects-dashboard/projects-dashboard.component';
import { ProjectAdditionComponent } from '../project-addition/project-addition.component';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { AdminComponent } from '../admin/admin.component';
import { AdminGridComponent } from '../admin-grid//admin-grid.component';
import { RegisterComponent } from '../register/register.component';
import { ConsentComponent } from '../consent/consent.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }, {
    path: 'landing',
    component: LandingComponent
  }, {
    path: 'consent',
    component: ConsentComponent
  }, {
    path: 'users',
    component: UsersComponent
  },  {
    path: 'register',
    component: RegisterComponent
  },{
    path: 'grid',
    component: AdminGridComponent
  },{
    path: 'admin',
    component: AdminComponent
  },{
    path: 'documentation',
    component: DocumentationComponent
  }, {
    path: 'projects',
    component: ProjectsComponent,
    children: [
      { path: 'dashboard', component: ProjectsDashboardComponent },
      { path: 'add', component: ProjectAdditionComponent},
      { path: ':id', component: ProjectDetailComponent },
      { path: 'profile', component: UserProfileComponent}
    ]
  }, {
    path: 'irb',
    component: IrbComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRouterModule { }
