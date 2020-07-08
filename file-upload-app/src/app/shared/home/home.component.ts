import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/services/account.service';
import { User } from 'src/app/account/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  constructor(
    private authService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.authUser.subscribe(res => this.user = res);
  }

  logOut(): void {
    this.authService.setAuth({} as User);
    window.location.reload();
  }

}