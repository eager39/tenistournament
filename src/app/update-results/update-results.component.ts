import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { asTextData } from '@angular/core/src/view';

@Component({
  selector: 'app-update-results',
  templateUrl: './update-results.component.html',
  styleUrls: ['./update-results.component.css']
})
export class UpdateResultsComponent implements OnInit {

  constructor(private http: HttpClient) {
    

    
  }; 
 
   matchupform:FormGroup;
   arr = new FormArray([]);
  httpOptions ={};
  
 matchups = [];

getMatches(){
  
  this.http.get < any > ("http://localhost:3000/getmatches", this.httpOptions).subscribe(({
    data
  }) => {
   
    console.log(data);
   this.matchups=data;
   this.matchupform=new FormGroup({ 'arr': this.arr });
   
   for(var i=0; i < this.matchups.length; i++){
     this.arr.push(new FormControl("", [Validators.required]));
   } 

  });
 
}

  ngOnInit() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("currentUser")
      })
    };
  this.getMatches();

  }
  onSubmit() {
   if(this.matchupform.value!=""){
    console.log(this.matchupform.value);
   }
   this.http.post("http://localhost:3000/update",this.matchupform.value)
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
		 
     this.getMatches();
          
    
   
      
    
  
    
  
    
  }

}
