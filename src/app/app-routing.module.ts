import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ProductsComponent} from './products/products.component';
import {RegisterComponent} from './register/register.component';
import {AdminComponent} from './admin/admin.component';
import {AuthGuard} from './auth.guard';
import {ClientComponent} from './client/client.component';
import {OwnerComponent} from './owner/owner.component';
import {SaveProductComponent} from './save-product/save-product.component';
import {CartComponent} from './cart/cart.component';
import {AboutComponent} from './about/about.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'client', component: ClientComponent, canActivate: [AuthGuard]},
  {path: 'owner', component: OwnerComponent, canActivate: [AuthGuard]},
  {path: 'owner/product', component: SaveProductComponent, canActivate: [AuthGuard]},
  {path: 'owner/product/:id', component: SaveProductComponent, canActivate: [AuthGuard]},
  {path: 'logout', component: HomeComponent},
  {path: 'cart', component: CartComponent},
  {path: 'cart/:id', component: CartComponent},
  {path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
