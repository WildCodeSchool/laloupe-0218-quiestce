import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  images: Array<string>;

  constructor(public auth: AuthService,
    private router: Router) { }

  ngOnInit() {

  }
  createGame() {
    this.router.navigate(['matchmaking']);
  }

}
