import {Injectable} from '@angular/core';

const CART_ITEMS = 'CART';

@Injectable()
export class CartStorage {

  public saveCart(items: string) {
    window.sessionStorage.removeItem(CART_ITEMS);
    window.sessionStorage.setItem(CART_ITEMS, items);
  }

  public getCart(): string {
    return sessionStorage.getItem(CART_ITEMS);
  }

  public disposeCart() {
    window.sessionStorage.removeItem(CART_ITEMS);
    window.sessionStorage.setItem(CART_ITEMS, null);
  }
}
