import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DataService } from '../data-service.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class tournamentComponent implements OnInit {


  constructor(private http: HttpClient,private route: ActivatedRoute,private _dataService: DataService) {
    
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("currentUser")
      })
    };
    
  
    
  }; // better :D 
turnir;
  httpOptions ={};
  id: number;
  private sub: any;
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(localStorage.getItem("currentUser"));
 
 
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
      
      this._dataService.add(this.tournament.value,"createTour",this.httpOptions)
        .subscribe(
            (val) => {
              this.getTours();
                console.log("POST call successful value returned in body", 
                            val);
            },
            response => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now completed.");
            });
         
            
      
     
        
      
      this.tournament.reset();
       
      }
  }
  

getTours(){
  this._dataService.getAll(this.httpOptions,"getTours").subscribe((
    data:any
  ) => {
 this.turnir=data;
    console.log(this.turnir);
  });
}

  

  ngOnInit() {
    this.sub = this.route.url.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.getTours();
  });
   

};


}
