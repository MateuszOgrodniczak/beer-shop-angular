import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../order';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TokenStorage} from '../core/token.storage';
import {ToastrService} from 'ngx-toastr';
import {Product} from '../product';
import * as $ from 'jquery';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private orders = new Array<Order>();
  private orderProductsWithAmounts = new Map<number, Map<Product, number>>();
  private customDate = 'dd.MM.y, HH:mm';
  private readonly imageType: string = 'data:image/jpg;base64,';
  constructor(private http: HttpClient, private tokenStorage: TokenStorage,
              private toastr: ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const token = this.tokenStorage.getToken();
    if (token != null) {
      const decodedToken = new JwtHelperService().decodeToken(token);
      const clientName = decodedToken.sub;
      this.http.get('http://localhost:8080/client/orders?clientName=' + clientName)
        .subscribe(data => {
          this.orders = Object.assign(new Array<Order>(), data);
        }, error => {
          console.log(error);
        });
    } else {
      this.toastr.error('An error occurred');
    }
  }

  hasOrders(): boolean {
    return this.orders.length > 0;
  }

  show(orderId: number) {
    if (!this.orderProductsWithAmounts.has(orderId)) {
      const orders = this.orders.filter(o => this.hasId(o, orderId));
      const productIdsToAmounts = orders[0].products;
      const productsToAmounts = new Map<Product, number>();
      Object.keys(productIdsToAmounts).forEach(key => {
        this.http.get('http://localhost:8080/client/products/' + key)
          .subscribe(data => {
            const product = Object.assign(new Product(0, '', '', 0, null, ''), data);
            product.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageType + product.image);
            productsToAmounts.set(product, productIdsToAmounts[key]); // get(Number.parseInt(key, 10)));
          });
      });
      this.orderProductsWithAmounts.set(orderId, productsToAmounts);
    }
    $('#orderProducts_' + orderId).show();
  }

  hide(orderId: number) {
    $('#orderProducts_' + orderId).hide();
  }

  hasId(order: Order, id: number): boolean {
    return order.id === id;
  }
}
