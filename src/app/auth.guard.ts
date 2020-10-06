
import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {TokenStorage} from './core/token.storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenStorage: TokenStorage,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
 /*   const currentUser = this.authService.currentUserValue;
    const tokenPayload*/
    const token = this.tokenStorage.getToken();

    if (token != null && token !== 'null') {
      console.log(token);
      const helper = new JwtHelperService();
      console.log(helper.decodeToken(token));
      if (helper.isTokenExpired(token)) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.toastr.error('Session expired. Please log in again.');
        return false;
      }
      const tokenString = helper.decodeToken(token);
      const role = '/' + tokenString['scopes'][0].authority.toString().toLowerCase();
      console.log('router: ' + this.router.getCurrentNavigation().extractedUrl);
      const extractedUrl = this.router.getCurrentNavigation().extractedUrl.toString();
      if (!extractedUrl.startsWith(role)) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.toastr.error('You have no authority to access this content.');
        return false;
      }
      // this.router.navigate([role], { queryParams: { returnUrl: state.url } });
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

