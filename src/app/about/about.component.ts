import {Component, OnInit} from '@angular/core';
import {Shop} from '../shop';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  private shop: Shop;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('http://localhost:8080/owner/shop/query')
      .subscribe(data => {
        if ( data === null || data === undefined) {
          return;
        }
        this.shop = Object.assign(new Shop(0, '', '', '', '', '', '', ''), data);
      }, error => {
        console.log(error);
      });
  }

  isShopRegistered() {
    return !(this.shop === null || this.shop === undefined || this.shop.id === 0);
  }
}
