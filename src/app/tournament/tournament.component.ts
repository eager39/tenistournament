import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class tournamentComponent implements OnInit {


  constructor(private http: HttpClient,private route: ActivatedRoute) {
    
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("currentUser")
      })
    };
    
  
    
  }; // better :D 
  httpOptions ={};
  id: number;
  private sub: any;
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(localStorage.getItem("currentUser"));
 
 igralec = new FormGroup ({
    ime: new FormControl()


  });
  tournament = new FormGroup ({
   datum: new FormControl(),
   kraj: new FormControl(),
   user:new FormControl()

  });
  createTournament(){
    
    if(this.tournament.valid){
      this.tournament.patchValue({
       user:this.decodedToken.user
      });
    console.log(this.tournament.value);
      
      this.http.post("http://localhost:3000/createTour",this.tournament.value,this.httpOptions)
        .subscribe(
            (val) => {
                console.log("POST call successful value returned in body", 
                            val);
            },
            response => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now completed.");
            });
         
            
      
     
        
      
      this.igralec.reset();
       
      }
  }
  
onSubmit() {
  if(this.igralec.valid){
  console.log(this.igralec.value);
  
  this.http.post("http://localhost:3000/test",this.igralec.value)
    .subscribe(
        (val) => {
            console.log("POST call successful value returned in body", 
                        val);
        },
        response => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        });
		 
        
  
 
		
  
  this.igralec.reset();
   
	}
	

  
}
  

  ngOnInit() {
    this.sub = this.route.url.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(params);
  });
   

};


}
