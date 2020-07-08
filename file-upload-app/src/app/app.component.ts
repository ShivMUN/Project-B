import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'file-upload-app';
  enableHomePage = false;

  constructor(private router: Router, private authService: AccountService) { }
  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(
      res => {
        console.log(`Is authenticated ${res}`);
        if (!res) {
          // this.router.navigateByUrl('/login'); // navigate to login
          this.router.navigate([{ outlets: { login_outlet: 'login' } }]);
          this.enableHomePage = false;
        }
        else {
          this.enableHomePage = true;
        }
      }
    );
  }


}
