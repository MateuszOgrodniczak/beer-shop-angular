import { Component, OnInit } from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private users = new Array<User>();
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {
    this.http.get('http://localhost:8080/admin/users')
      .subscribe(data => {
        this.users = Object.assign(new Array<User>(), data);
      });
  }

  enableUser(id: number) {
    this.http.get('http://localhost:8080/admin/users/enable/' + id)
      .subscribe(data => {
        this.toastr.success('User ' + id + ' enabled successfully');
        setTimeout(() => window.location.reload(), 1000);
      }, error => {
        console.log(error);
        this.toastr.error('User ' + id + ' could not be enabled');
      });
  }

  disableUser(id: number) {
    this.http.get('http://localhost:8080/admin/users/disable/' + id)
      .subscribe(data => {
        this.toastr.success('User ' + id + ' disabled successfully');
        setTimeout(() => window.location.reload(), 1000);
      }, error => {
        console.log(error);
        this.toastr.error('User ' + id + ' could not be disabled');
      });
  }
}
