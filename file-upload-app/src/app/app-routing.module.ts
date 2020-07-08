import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { FileuploadComponent } from './upload/fileupload/fileupload.component';
import { FileslistComponent } from './upload/fileslist/fileslist.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, outlet: 'login_outlet' },
  { path: 'fileupload', component: FileuploadComponent },
  { path: 'filelist', component: FileslistComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
