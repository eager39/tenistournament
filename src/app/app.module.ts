import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MatchupsComponent } from './matchups/matchups.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './authguard.service';
import { HomeComponent } from './home/home.component';
import { UpdateResultsComponent } from './update-results/update-results.component';



@NgModule({
  declarations: [
    AppComponent,
    MatchupsComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UpdateResultsComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
	ReactiveFormsModule,
	HttpClientModule,
	AppRoutingModule
	
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
