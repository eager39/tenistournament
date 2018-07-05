import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  

  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient) {
      
    
   }

   userService(user){
      return this.http.post('http://localhost:3000/api/users', user);
  }
  get f() { return this.registerForm.controls; }
   onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;
    this.userService(this.registerForm.value)
        .subscribe(
            data => {
                console.log(data);
                this.router.navigate(['/login']);
            },
            error => {
              console.log(error.statusText);
                this.loading = false;
            });
}



  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }

}
