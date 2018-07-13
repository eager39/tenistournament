import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { MatchupsComponent } from './matchups/matchups.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './authguard.service';
import { HomeComponent } from './home/home.component';
import { UpdateResultsComponent } from './update-results/update-results.component';

const routes: Routes = [
  { path: 'matchups', component: MatchupsComponent, canActivate: [AuthGuard]  },
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:"home",component: HomeComponent},
  {path:"update",component:UpdateResultsComponent},
  {path:"**",component: HomeComponent}
  
];

@NgModule({
  exports: [
   RouterModule
  ],
  imports: [ RouterModule.forRoot(routes) ]
 
})
export class AppRoutingModule {
  
 }
