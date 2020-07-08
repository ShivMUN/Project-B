import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/account/services/account.service';
import { Router } from '@angular/router';
import { User } from 'src/app/account/models/user';


@Component({
  selector: 'app-fileslist',
  templateUrl: './fileslist.component.html',
  styleUrls: ['./fileslist.component.css']
})
export class FileslistComponent implements OnInit {

  user: User;
  isError: boolean;
  message: string;
  baseUrl: string;
  filelist: IFile[];


  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private router: Router, private authService: AccountService
  ) {
    // get the base URL and host and port details of the api from the enviroment file
    this.baseUrl = `${environment.protocol}${environment.host}${environment.port}`;
  }

  ngOnInit(): void {
    // store the userdetails in local variable "User"
    this.authService.authUser.subscribe(authUser => this.user = authUser);
    this.loadFile();

  }

  // trigger this method when alert message "X" is clicked
  closePopup() {
    this.isError = false;
    this.message = null;
  }


  loadFile() {
    this.spinner.show(); // start the spinner loader

    // get the data to the api using http client of the angular i.e performing an ajax request
    this.http.get('../../../assets/mock/filelist.json')      // pass the UserID to get the current user files only
      .subscribe((res: IFile[]) => {
        console.log(res);
        this.filelist = res;
        this.isError = false;
        this.spinner.hide(); // close the spinling loader
      }, (error: any) => {
        console.log(error);  // log the error in the console
        this.message = error.message;
        this.isError = true; // update the error flag as true ... to show error message in UI
        this.spinner.hide(); // close the spinling loader
      });


  }

  downloadFile(id: string) {
    console.log(`file id to download ${id}`);

    this.spinner.show(); // start the spinner loader
    // get the data to the api using http client of the angular i.e performing an ajax request
    this.http.get(`${this.baseUrl}/download/${id}`)      // pass the fileId to get the  files from the API
      .subscribe((res: any) => {
        if (res) {
          this.isError = false;
          this.spinner.hide(); // close the spinling loader
        }
      }, (error: any) => {
        console.log(error);  // log the error in the console
        this.message = error.message;
        this.isError = true; // update the error flag as true ... to show error message in UI
        this.spinner.hide(); // close the spinling loader
      });


  }

  deleteFile(id: string) {
    console.log(`file id to delete ${id}`);
    this.spinner.show(); // start the spinner loader

    // get the data to the api using http client of the angular i.e performing an ajax request
    this.http.post(`${this.baseUrl}/delete`, { id })      // pass the UserID to get the current user files only
      .subscribe((res: any) => {
        if (res) {
          this.isError = false;
          this.message = 'file deleted successfully!'; // success message to show in UI
          this.spinner.hide(); // close the spinling loader
          this.loadFile();
        }
      }, (error: any) => {
        console.log(error);  // log the error in the console
        this.message = error.message;
        this.isError = true; // update the error flag as true ... to show error message in UI
        this.spinner.hide(); // close the spinling loader
      });

  }


}



interface IFile {
  id: string;
  fileName: string;
  contentType: string;
  size: string;
}
