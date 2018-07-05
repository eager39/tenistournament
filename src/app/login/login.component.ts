import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }
authenticationService(user){
  return this.http.post<any>('http://localhost:3000/api/auth', user);
} 
get f() { return this.loginForm.controls; }
    onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
      
 
      this.loading = true;
      this.authenticationService(this.loginForm.value)
          .subscribe(
              data => {
                if(data.status=="false"){
                  this.loading=false;
                  console.log(data.status);
                }else{
                
                localStorage.setItem('currentUser', data.token);
                console.log(localStorage.getItem("currentUser"));
                  this.router.navigate([this.returnUrl]);
                }
              },
              error => {
                  
                  this.loading = false;
              });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


}
