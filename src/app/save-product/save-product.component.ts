import {Component, OnInit} from '@angular/core';
import {Product} from '../product';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-save-product',
  templateUrl: './save-product.component.html',
  styleUrls: ['./save-product.component.css']
})
export class SaveProductComponent implements OnInit {
  private product = new Product(0, '', '', null, null, null);
  private form;
  private url;
  imageURL: SafeUrl;
  private readonly imageType: string = 'data:image/jpg;base64,';

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.prepareForm();

    const routerUrl = this.router.url;
    const splitUrl = routerUrl.split('product/');
    if (splitUrl.length > 1) {
      this.http.get('http://localhost:8080/owner/products?productId=' + splitUrl[1])
        .subscribe(data => {
          const queriedProduct = Object.assign(new Product(0, '', '', 0.0, null, null), data[0]);
          console.log('queriedProduct');
          console.log(queriedProduct);
          this.form.patchValue({
            id: queriedProduct.id,
            name: queriedProduct.name,
            description: queriedProduct.description,
            cost: queriedProduct.cost,
            image: queriedProduct.image
          });
          console.log(this.form);
          this.product = Object.assign(this.product, data[0]);
          // this.prepareForm();
          this.imageURL = this.sanitizer.bypassSecurityTrustUrl(this.imageType + this.product.image);
        }, error => {
          console.log('ERROR');
          console.log(error);
        });
      console.log(this.product);
    }
  }

  prepareForm() {
    this.form = new FormGroup({
      id: new FormControl(this.product.id),
      name: new FormControl(this.product.name, [
        Validators.required,
      ]),
      description: new FormControl(this.product.description, [
        Validators.required,
      ]),
      cost: new FormControl(this.product.cost, [
        Validators.required,
        Validators.pattern('^[0-9]+(.[0-9]+)?$'),
        Validators.min(0.0)
      ]),
      image: new FormControl(this.product.image, [])
    });
  }

  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imageURL = null;
  }

  onSubmit() {
    console.log('submit');
    Object.keys(this.form.controls).forEach(field => { // {1}
      const control = this.form.get(field);            // {2}
      control.markAsTouched({onlySelf: true});       // {3}
    });
    if (this.form.status === 'INVALID') {
      return;
    }

    const formData = new FormData();
    formData.append('image', this.form.value.image);

    this.product.name = this.form.value.name;
    this.product.description = this.form.value.description;
    this.product.id = this.form.value.id;
    this.product.cost = this.form.value.cost;

    console.log('image');
    console.log(formData.get('image'));

    const productBlob = new Blob([JSON.stringify(this.product)], {type: 'application/json'});
    formData.append('product', productBlob);

    this.http.post<any>('http://localhost:8080/owner/product', formData)
      .subscribe(data => {
          this.router.navigate(['/owner']);
          this.toastr.success('Product data saved.');
        },
        error => {
          console.log('err: ' + error);
          this.toastr.error('An error occurred. Please try again later.');
        });
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get cost() {
    return this.form.get('cost');
  }

  get image() {
    return this.form.get('image');
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}
