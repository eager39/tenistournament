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
  httpOptions = {};
  podatkiIgralca = [];
  matchups=[];
  igralec = new FormGroup({
    ime: new FormControl()
  });
  constructor(private http: HttpClient, private route: ActivatedRoute, private _dataService: DataService) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'token': localStorage.getItem("currentUser")
        }),
        params: new HttpParams().set("id", this.id)
      };
    });
    this.nextRound();
    this.getAllMatches();
  }

  generateDraw() {
    var isDrawn;
    this._dataService.getAll(this.httpOptions, "ifdrawn").subscribe((
      data: any
    ) => {
      isDrawn = data[0].isDrawn;
      if (isDrawn != 1) {
        var matchups = [];
        var used = new Array();
        this._dataService.getAll(this.httpOptions, "igralci").subscribe((
          data: any
        ) => {
          var add = 0;
          var count = data.length;
          var numrounds = Math.ceil((Math.log2(count)));
          add = Math.pow(2, Math.ceil(Math.log(count) / Math.log(2))) - count;
          for (var i = 0; i < add; i++) {
            data.push({
              ime: "bye",
              id_igralec: "bye"
            });
          }
          count = Math.floor(data.length / 2);
          var a = 0;
          for (let i = 0; i < count; i++) {
            a++;
            var random = Math.floor(Math.random() * count) + count;
            if (!used.includes(random)) {
              used.push(random);
              console.log(data[i].ime + " VS " + (data[random].ime));

              matchups.push([data[i].id_igralec, data[random].id_igralec, 1, "", this.id, i, 0]);
              if (matchups[i][0] == "bye") {
                matchups[i][3] = matchups[i][1];
              }
              if (matchups[i][1] == "bye") {
                matchups[i][3] = matchups[i][0];
              }
            } else {
              i--;
            }

          }
          let matchups_rounds = {};
          matchups_rounds["matchups"] = matchups;
          matchups_rounds["rounds"] = numrounds;

          //console.log(a);
          console.log(matchups);
          this._dataService.add(matchups_rounds, "matchups")
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
  dodajIgralca() {

    if (this.igralec.valid) {
      this.podatkiIgralca = [];
      this.podatkiIgralca.push({
        "ime": this.igralec.value.ime,
        "turnir": this.id
      })
      this._dataService.add(this.podatkiIgralca, "addPlayer", this.httpOptions)
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
  nextRound() {
    var isDrawn;
    this._dataService.getAll(this.httpOptions, "ifdrawn").subscribe((
      data: any
    ) => {
      isDrawn = data[0].isDrawn;
      if (isDrawn == 1) {
        this._dataService.getAll(this.httpOptions, "nextround").subscribe((
          data: any
        ) => {

          var matchups = [];
          let count = data.length;
          let pair = 0;
          let a;
          if (data[0].tretje_mesto) {
            matchups.push([data[0].tretje_mesto, data[1].tretje_mesto, 66, "", this.id, 0, 0]);
            pair++;
          } else {
            for (let i = 0; i < count; i++) {
              for (a = i + 1; a < count; a++) {
                if (data[i].position == data[a].position && data[i].round == data[a].round && data[i].rezultat != "" && data[a].rezultat != "") {
                  matchups.push([data[i].rezultat, data[a].rezultat, parseInt(data[i].round) + 1, "", this.id, data[i].position, 0]);
                  pair++;
                  break;
                }
              }
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
          if (pair) {
            this._dataService.add(matchups, "nextroundMatches")
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
    })
  }
getAllMatches(){
  this._dataService.getAll(this.httpOptions, "getAllMatches").subscribe((
    data: any
  ) => {
    
    this.matchups=data;
    console.log(this.matchups);
  });
}


};
