import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/account/services/account.service';


@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  isError: boolean;
  message: string;
  fileName: string;
  files: File;
  userSession: any;


  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private accountService: AccountService
  ) { }


  saveFile(file: File) {
    this.spinner.show();
    console.log(`file selected ${file}`);
    this.fileName = file[0]?.name;
    this.files = file;
    this.spinner.hide();
  }

  ngOnInit(): void {
    this.accountService.authUser.subscribe((auth) => {
      console.log(`active user - ${JSON.stringify(auth)}`);
      this.userSession = auth;
    }); // save the current logged in user session in the variable.
  }

  closePopup() {
    this.isError = false;
    this.message = null;
  }

  upload() {
    console.log(this.userSession);
    console.log(this.files);
    const formData = new FormData();   // create a formdata object to post file type data encoding type is multipart/form-data

    formData.append('userSession', JSON.stringify(this.userSession)); // append the Current user login session.
    formData.append('upload_file', this.files[0]);  // append the file in the formdata manually
    // append the user details also in the form data

    // get the base URL and host and port details of the api from the enviroment file
    const baseUrl = `${environment.protocol}${environment.host}${environment.port}`;

    this.spinner.show(); // start the spinling loader

    // post the data to the api using http client of the angular i.e performing an ajax request
    this.http.post(`${baseUrl}/upload`, formData)
      .subscribe((res: any) => {
        console.log(res);
        this.fileName = null;
        this.files = null;
        this.message = res.message;
        this.isError = false;
        this.spinner.hide(); // close the spinling loader
      }, (error: any) => {
        console.log(error);  // log the error in the console
        this.message = error.message;
        this.isError = true;
        this.spinner.hide(); // close the spinling loader
      });

  }

}
