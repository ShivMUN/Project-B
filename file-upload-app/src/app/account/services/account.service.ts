import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { User } from '../models/user';
import { distinctUntilChanged } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  defaultUser: User = {
    _id: '5edcd666574ec89375a0bed6',
    name: 'karthik mani',
    userName: 'kmani',
    picture: 'http://localhost:8080/images/kartik_dp.PNG'
  };

  private authUserSubject = new BehaviorSubject<User>({} as User);
  // private authUserSubject = new BehaviorSubject<User>(this.defaultUser);
  public authUser = this.authUserSubject.asObservable().pipe(distinctUntilChanged());

  //private isAuthenticatedSubject = new ReplaySubject<boolean>(0);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor() { }

  setAuth(user: User) {
    // Set current user data into observable
    this.authUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }


}
