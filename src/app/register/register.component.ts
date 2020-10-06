import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {RegisterForm} from '../register-form';
import * as bcrypt from 'bcryptjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model = new RegisterForm('', '', '', '', '', '', '');
  form;

  constructor(private toastr: ToastrService, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(this.model.firstName, [
        Validators.required
      ]),
      lastName: new FormControl(this.model.lastName, [
        Validators.required
      ]),
      email: new FormControl(this.model.email, [
        Validators.required,
        Validators.email
      ]),
      username: new FormControl(this.model.username, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]),
      role: new FormControl(this.model.role, [
        Validators.required
      ]),
      password: new FormControl(this.model.password, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(this.model.confirmPassword, [
        Validators.required
      ])
    });
  }


  onSubmit() {
    Object.keys(this.form.controls).forEach(field => { // {1}
      const control = this.form.get(field);            // {2}
      control.markAsTouched({onlySelf: true});       // {3}
    });

    if (this.form.status === 'INVALID') {
      return;
    }

    if (this.form.controls['password'] !== this.form.controls['confirmPassword']) {
      this.form.controls['password'].setErrors({passwordsNoMatch: true});
      this.form.controls['confirmPassword'].setErrors({passwordsNoMatch: true});
    }

/*    const salt = bcrypt.genSaltSync(10);
    this.form.value.password = bcrypt.hashSync(this.form.value.password, salt);
    this.form.value.confirmPassword = this.form.value.password;*/

    this.http.post<any>('http://localhost:8080/home/register', this.form.value)
      .subscribe(data => {
          this.router.navigate(['login']);
          this.toastr.success('Account created');
        },
        error => {
          console.log('err: ' + error);
          this.toastr.error('Error');
        });
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get role() {
    return this.form.get('role');
  }
}
