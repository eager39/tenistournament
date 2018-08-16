import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data-service.service';

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
    private _dataService: DataService
  ) { }

get f() { return this.loginForm.controls; }
    onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
      
 
      this.loading = true;
      this._dataService.add(this.loginForm.value,"auth")
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
