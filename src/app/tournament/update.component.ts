import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray } from '@angular/forms';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { asTextData } from '@angular/core/src/view';
import { ActivatedRoute } from '@angular/router';
import { nextTick } from 'q';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor(private http: HttpClient,private route: ActivatedRoute) {
    

    
  }; 
 
   matchupform:FormGroup;
   arr = new FormArray([]);
  httpOptions ={};
  private sub: any;
  id: any;
 matchups = [];

getMatches(){
  
  this.http.get < any > ("http://localhost:3000/getmatches", { headers:this.httpOptions,params:new HttpParams().set('id', this.id)}).subscribe(({
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
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(this.id);
  });
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
                      this.getMatches(); 
        },
        response => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        });
		 
     
          
         
    
   
      
    
  
    
  
    
  }

}