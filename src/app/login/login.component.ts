import { Component, OnInit } from '@angular/core';
import {LoginForm} from '../login-form';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/internal/operators/first';
import {TokenStorage} from '../core/token.storage';
import {AuthService} from '../core/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  model = new LoginForm('', '');
  returnUrl: string;
  constructor(private toastr: ToastrService, private formBuilder: FormBuilder,
              private authService: AuthService, private token: TokenStorage, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(this.model.username, [
        Validators.required
      ]),
      password: new FormControl(this.model.password, [
        Validators.required
      ])
    });
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(): void {
    Object.keys(this.form.controls).forEach(field => { // {1}
      const control = this.form.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });

    if (this.form.status === 'INVALID') {
      return;
    }

    this.authService.attemptAuth(this.form.value.username, this.form.value.password).subscribe(
      data => {
        console.log('data: ' + data);
        this.token.saveToken(data.token);

        console.log('Logged in, token: ' + data.token);
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(data.token);
        const role = '/' + decodedToken['scopes'][0].authority.toString().toLowerCase();
        this.router.navigate([role]);
      },
      error => {
        console.log('err: ' + error);
        this.toastr.error('User does not exist');
      }
    );
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
}
