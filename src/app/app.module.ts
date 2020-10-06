import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToastrModule} from 'ngx-toastr';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {ProductsComponent} from './products/products.component';
import {ClientComponent} from './client/client.component';
import {AdminComponent} from './admin/admin.component';
import {OwnerComponent} from './owner/owner.component';
import {AuthService} from './core/auth.service';
import {TokenStorage} from './core/token.storage';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './core/inteceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SaveProductComponent} from './save-product/save-product.component';
import {CartComponent} from './cart/cart.component';
import {AboutComponent} from './about/about.component';
import {CartStorage} from './core/cart-storage';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProductsComponent,
    ClientComponent,
    AdminComponent,
    OwnerComponent,
    SaveProductComponent,
    CartComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [AuthService, TokenStorage, CartStorage,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
