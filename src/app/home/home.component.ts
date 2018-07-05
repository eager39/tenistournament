import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
  logout(){
    localStorage.removeItem('currentUser');
  }
  isLoggedIn(){
    if(localStorage.getItem("currentUser")){
      return true;
    }else{
      return false;
    }
  }
  ngOnInit() {
  }

}
