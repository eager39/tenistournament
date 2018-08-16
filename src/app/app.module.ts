import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './authguard.service';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './tournament/details.component';
import { tournamentComponent } from './tournament/tournament.component';
import { UpdateComponent } from './tournament/update.component';
import { DataService } from './data-service.service';
import {Configuration} from './app.settings';





@NgModule({
  declarations: [
    AppComponent,
    tournamentComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DetailsComponent,
    UpdateComponent
    
    
  ],
  imports: [
    BrowserModule,
	FormsModule,
	ReactiveFormsModule,
	HttpClientModule,
	AppRoutingModule
	
  ],
  providers: [AuthGuard,DataService,Configuration],
  bootstrap: [AppComponent]
})
export class AppModule { }
