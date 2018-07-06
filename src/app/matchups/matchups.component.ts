import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-matchups',
  templateUrl: './matchups.component.html',
  styleUrls: ['./matchups.component.css']
})
export class MatchupsComponent implements OnInit {

  

  constructor(private http: HttpClient) {
    

    
  }; // better :D 
  httpOptions ={};
 
 igralec = new FormGroup ({
    ime: new FormControl()


  });

  generateDraw() {
   
    var isDrawn;
    this.http.get < any > ("http://localhost:3000/ifdrawn", this.httpOptions).subscribe(({
      data
    }) => {
      console.log("haha");
      isDrawn = data[0].isDrawn;
      console.log(isDrawn);
      if (isDrawn!=1) {
        var matchups = [];
        var used = new Array();
        this.http.get < any > ("http://localhost:3000/igralci", this.httpOptions).subscribe(({
          data
        }) => {
          var count = data.length;
          var numrounds = Math.ceil((Math.log2(12)));
          console.log(numrounds);
          if(count!= 16){
            var add=32-count;
            for(var i=0;i<add;i++){
              console.log(i);
            data.push({
              ime: "bye",
              id_igralec:"bye"
            });
            count++;
         
            }
               
          }
          console.log(data);
          count = Math.floor(data.length/2);
          console.log(count);
         // if (count % 2 == 1 ) {
          //  data.push({
          //    ime: "FREEWIN"
          //  });
         // }
        //  count++;
          var a = 0;
          for (let i = 0; i < count; i++) {
            a++;
            var random = Math.floor(Math.random() * count) + count;
            if (!used.includes(random)) {
              used.push(random);
              console.log(data[i].ime + " VS " + (data[random].ime));
  
              matchups.push([data[i].id_igralec, data[random].id_igralec, 1, "",1, i,0]);
              if(matchups[i][0]=="bye"){
                matchups[i][3]=matchups[i][1];
              }
              if(matchups[i][1]=="bye"){
                matchups[i][3]=matchups[i][0];
              }
              /* matchups.push({
                 home: data[i].ime, 
                  away:  data[random].ime,
                  round:1,
                  rezultat:"",
                  turnir:1,
                  position:i
                  
                  
                  
              });*/
            } else {
              i--;
            }
  
          }
          //console.log(a);
          console.log(matchups);
          this.http.post("http://localhost:3000/matchups", matchups)
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
        })
      } else {
        console.log("Was drawn");
      }
    });
  
  
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
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("currentUser")
      })
    };
    var isDrawn;
    this.http.get < any > ("http://localhost:3000/ifdrawn", this.httpOptions).subscribe(({
      data
    }) => {
      isDrawn = data[0].isDrawn;
      console.log(isDrawn);
      if(isDrawn==1){

     console.log("hahaasdasd");
    this.http.get < any > ("http://localhost:3000/nextround", this.httpOptions).subscribe(({
      data
    }) => {
console.log(data);
var matchups = [];
        let count = data.length;
        let pair=0;
        let a;
         console.log(count);
         
    
         
          
          for (let i = 0; i < count; i++) {
            
             
            for(a=i+1;a<count;a++){ 
           
              if(data[i].position==data[a].position && data[i].rezultat!="" && data[a].rezultat!=""){
     
                     matchups.push([data[i].rezultat, data[a].rezultat, parseInt(data[i].round)+1, "", 1,data[i].position,0]);
                     pair++;
                    break;
              
            }
            }
            
            



             // console.log(data[i].rezultat + " VS " + (data[i+1].rezultat));
            
           
              /* matchups.push({
                 home: data[i].ime, 
                  away:  data[random].ime,
                  round:1,
                  rezultat:"",
                  turnir:1,
                  position:i
                  
                  
                  
              });*/
          } 
          if(pair){
             this.http.post("http://localhost:3000/matchups", matchups)
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
            }
              
  console.log(matchups);
          
    });
  }
}
)};

}
