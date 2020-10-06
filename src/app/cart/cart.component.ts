import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Order} from '../order';
import {Product} from '../product';
import {DomSanitizer} from '@angular/platform-browser';
import {CartStorage} from '../core/cart-storage';
import {TokenStorage} from '../core/token.storage';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Toast, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private order = new Order(0, 0, null, new Map<number, number>(), {}, '');
  private products = new Map<Product, number>();
  private product = new Product(0, '', '', 0.0, null, null);
  private readonly imageType: string = 'data:image/jpg;base64,';
  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer, private cartStorage: CartStorage,
              private tokenStorage: TokenStorage, private toastr: ToastrService) { }

  ngOnInit() {
    const cartItems = this.cartStorage.getCart();
    if (cartItems == null || cartItems === '') {
      return;
    }
    const cartItemsIds = cartItems.split(',');
    for (const itemId of cartItemsIds) {
      this.http.get('http://localhost:8080/owner/products?productId=' + itemId)
        .subscribe(data => {
          const queriedProduct = Object.assign(this.product, data[0]);
          queriedProduct.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageType + data[0].image);
          if (this.products.has(queriedProduct)) {
            this.products.set(queriedProduct, this.products.get(queriedProduct) + 1);
          } else {
            this.products.set(queriedProduct, 1);
          }
          // this.products.push(queriedProduct);
          this.order.cost += data[0].cost;
        }, error => {
          console.log(error);
        });
    }
  }

  remove(product: Product) {
    this.order.cost -= product.cost;
    this.products.set(product, this.products.get(product) - 1);
    if (this.products.get(product) === 0) {
      this.products.delete(product);
    }
    /*const index: number = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
    }*/
    let items = this.cartStorage.getCart();
    items = items.replace(product.id + '', '');
    items = items.replace(',,', ',');
    if (items.endsWith(',')) {
      items = items.substr(0, items.length - 1);
    }
    if (items.startsWith(',')) {
      items = items.substr(1, items.length);
    }
    this.cartStorage.saveCart(items);
    console.log(this.cartStorage.getCart());
  }

  isEmpty() {
    return this.products.size === 0;
  }

  buy() {
    const token = this.tokenStorage.getToken();
    this.toastr.success('Your Order has been accepted');
    if (token != null) {
      const decodedToken = new JwtHelperService().decodeToken(token);
      if (decodedToken['scopes'][0].authority.toString() === 'CLIENT') {
        this.order.date = new Date();
        const cartItemsString = this.cartStorage.getCart();
        const cartItems = cartItemsString.split(',');
        const orderProducts = this.order.products;
        for (const cartItem of cartItems) {
          const cartItemId = Number.parseInt(cartItem, 10);
          if (orderProducts.has(cartItemId)) {
            orderProducts.set(cartItemId, orderProducts.get(cartItemId) + 1);
          } else {
            orderProducts.set(cartItemId, 1);
          }
        }
        this.order.products = orderProducts;
        this.order.clientName = decodedToken.sub;

        console.log('ORDER');
        console.log(this.order);

        const productsWrapper = {};
        this.order.products.forEach((val: number, key: number) => {
          productsWrapper[key] = val;
        });
        this.order.productsWrapper = productsWrapper;

        this.http.post('http://localhost:8080/client/order', this.order)
          .subscribe( data => {
            this.toastr.success('The order has been added to your shopping history. You can view it on the client site.');
          }, error => {
            console.log(error);
          });
      }
    }
  }
}
