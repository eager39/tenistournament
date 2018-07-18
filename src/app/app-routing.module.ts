import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { tournamentComponent, } from './tournament/tournament.component';
import { DetailsComponent } from './tournament/details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './authguard.service';
import { HomeComponent } from './home/home.component';
import { UpdateResultsComponent } from './update-results/update-results.component';

const routes: Routes = [
  { path: 'tournament', component: tournamentComponent, canActivate: [AuthGuard],
  children: [
    {path: ':id', component:DetailsComponent,canActivate: [AuthGuard],
 
  }, 
    
  ]
  
 },
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
