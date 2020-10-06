import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../product';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {CartStorage} from '../core/cart-storage';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private products: Array<Product>;
  private readonly imageType: string = 'data:image/jpg;base64,';
  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer, private cartStorage: CartStorage, private toastr: ToastrService) { }

  ngOnInit() {
    this.http.get('http://localhost:8080/owner/products')
      .subscribe(data => {
        this.products = Object.assign(new Array<Product>(), data);
        for (const product of this.products) {
          product.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageType + product.image);
        }
      }, error => {
        console.log(error);
      });
  }

  addToCart(id: number) {
    const items = this.cartStorage.getCart();
    if (items === null || items === '') {
      this.cartStorage.saveCart(id.toString());
    } else {
      this.cartStorage.saveCart(items + ',' + id);
    }
    this.toastr.success('Product added to cart');
  }
}
