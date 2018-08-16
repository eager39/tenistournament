import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { DataService } from '../data-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  id: any;
  private sub: any;
  httpOptions ={};
  podatkiIgralca=[];
  igralec = new FormGroup ({
    ime: new FormControl()


  });

  

  constructor(private http: HttpClient,private route: ActivatedRoute, private _dataService: DataService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(this.id);
  });
  this.nextRound();
}
  generateDraw() {
   
    var isDrawn;
    this._dataService.getAll({ headers:this.httpOptions,params:new HttpParams().set('id', this.id)},"ifdrawn").subscribe((
      data:any
    ) => {
      isDrawn = data.data[0].isDrawn;
      console.log(isDrawn);
      if (isDrawn!=1) {
        var matchups = [];
        var used = new Array();
        this._dataService.getAll({ headers:this.httpOptions,params:new HttpParams().set('id', this.id)},"igralci").subscribe((
          data:any
        ) => {
          console.log(data);
          var add=0;
          var count = data.length;
          var numrounds = Math.ceil((Math.log2(count)));
          console.log(numrounds);
        add= Math.pow(2, Math.ceil(Math.log(count)/Math.log(2)))-count;
        console.log(add);
          /*
          if(count<8){
            console.log("Premalo igralcev");
            return false;
          }else if(count>8 && count <16){
            add=16-count;
          }
          else if(count>16 && count <32){
            add=32-count;
          }
          else if(count>32 && count <64){
            add=64-count;
          }
          if(count!= 16){
             add=32-count;
          
          }*/
          for(var i=0;i<add;i++){
           
          data.push({
            ime: "bye",
            id_igralec:"bye"
          });
        
       
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
  
              matchups.push([data[i].id_igralec, data[random].id_igralec, 1, "",this.id, i,0]);
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
          let matchups_rounds={};
          matchups_rounds["matchups"]=matchups;
          matchups_rounds["rounds"]=numrounds;
          console.log(matchups_rounds);
          //console.log(a);
          console.log(matchups);
          this.http.post("http://localhost:3000/matchups", matchups_rounds)
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
    this.nextRound();
   
  }
  dodajIgralca(){
    
    if(this.igralec.valid){
      this.podatkiIgralca=[];
    this.podatkiIgralca.push({"ime":this.igralec.value.ime,"turnir":this.id})
    console.log(this.podatkiIgralca);
      
      this.http.post("http://localhost:3000/addPlayer",this.podatkiIgralca,this.httpOptions)
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
nextRound(){
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': localStorage.getItem("currentUser")
      })
    };
   
    var isDrawn;
    this.http.get < any > ("http://localhost:3000/ifdrawn",{ headers:this.httpOptions,params:new HttpParams().set('id', this.id)}).subscribe(({
      data
    }) => {
      console.log(data);
      isDrawn = data[0].isDrawn;
      console.log(isDrawn);
      if(isDrawn==1){
  
     console.log("hahaasdasd");
    this.http.get < any > ("http://localhost:3000/nextround", { headers:this.httpOptions,params:new HttpParams().set('id', this.id)}).subscribe(({
      data
    }) => {
      console.log("haha");
  console.log(data);
  var matchups = [];
        let count = data.length;
        let pair=0;
        let a;
         console.log(count);
         
      console.log(data[0]);
         if(data[0].tretje_mesto){
          matchups.push([data[0].tretje_mesto, data[1].tretje_mesto, 66, "",this.id, 0,0]);
          pair++;
         }else{
          
          for (let i = 0; i < count; i++) {
            
             
            for(a=i+1;a<count;a++){ 
           
              if(data[i].position==data[a].position &&data[i].round==data[a].round && data[i].rezultat!="" && data[a].rezultat!=""){
     
                     matchups.push([data[i].rezultat, data[a].rezultat, parseInt(data[i].round)+1, "", this.id,data[i].position,0]);
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
        }
          
          if(pair){
             this.http.post("http://localhost:3000/nextroundMatches", matchups)
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
  )
  }
  


};
