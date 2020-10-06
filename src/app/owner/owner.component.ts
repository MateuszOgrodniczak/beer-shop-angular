import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Shop} from '../shop';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TokenStorage} from '../core/token.storage';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Product} from '../product';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {
  private shop = new Shop(0, '', '', '', '', '', '', '');
  private form;
  private products: Array<Product>;
  private readonly imageType: string = 'data:image/jpg;base64,';

  constructor(private token: TokenStorage, private http: HttpClient, private toastr: ToastrService,
              private sanitizer: DomSanitizer, private router: Router) {
  }

  getImage(): Observable<Array<Product>> {
    return this.http.get('http://localhost:8080/owner/products')
      .map(response => {
        return Object.assign(new Array<Product>(), response);
      });
  }

  ngOnInit() {
    this.getImage()
      .subscribe((data: Array<Product>) => {
        // this.image = this.sanitizer.bypassSecurityTrustUrl(this.imageType + data[0].image);
        for (const product of data) {
           product.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageType + product.image);
        }
        this.products = data;
      });
    this.http.get('http://localhost:8080/owner/shop/query')
      .subscribe(data => {
          const savedShop = Object.assign(new Shop(0, '', '', '', '', '', '', ''), data);
          console.log(savedShop);
          this.updateShopModel(savedShop);
          this.updateShopForm(savedShop);
        },
        error => {
          console.log(error);
        });
    this.form = new FormGroup({
      name: new FormControl(this.shop.name, [
        Validators.required,
      ]),
      street: new FormControl(this.shop.street, [
        Validators.required,
      ]),
      postalCode: new FormControl(this.shop.postalCode, [
        Validators.required,
      ]),
      city: new FormControl(this.shop.city, [
        Validators.required,
      ]),
      phone: new FormControl(this.shop.phone, [
        Validators.required
      ]),
      email: new FormControl(this.shop.email, [
        Validators.required,
        Validators.email
      ]),
      ownerName: new FormControl(this.shop.ownerName)
    });
  }

  editProduct(id: number) {
    console.log(id);
    this.router.navigate(['/owner/product/' + id]);
  }

  updateShopModel(data: Shop) {
    this.shop.id = data.id;
    this.shop.name = data.name;
    this.shop.street = data.street;
    this.shop.postalCode = data.postalCode;
    this.shop.city = data.city;
    this.shop.ownerName = data.ownerName;
    this.shop.phone = data.phone;
    this.shop.email = data.email;
  }

  updateShopForm(data: Shop) {
    this.form.patchValue({
      name: data.name,
      street: data.street,
      postalCode: data.postalCode,
      city: data.city,
      ownerName: data.ownerName,
      phone: data.phone,
      email: data.email
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
    const token = this.token.getToken();
    const decodedToken = new JwtHelperService().decodeToken(token);
    this.form.value.ownerName = decodedToken.sub;

    this.http.post<any>('http://localhost:8080/owner/shop', this.form.value)
      .subscribe(data => {
          this.toastr.success('Shop data saved.');
        },
        error => {
          console.log('err: ' + error);
          this.toastr.error('An error occurred. Please try again later.');
        });
  }

  isShopRegistered() {
    return this.shop.id > 0;
  }

  get name() {
    return this.form.get('name');
  }

  get street() {
    return this.form.get('street');
  }

  get postalCode() {
    return this.form.get('postalCode');
  }

  get city() {
    return this.form.get('city');
  }

  get phone() {
    return this.form.get('phone');
  }

  get email() {
    return this.form.get('email');
  }
}
