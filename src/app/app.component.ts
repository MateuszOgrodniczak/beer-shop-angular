import { Component } from '@angular/core';
import {TokenStorage} from './core/token.storage';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Beer Shop Project';

  constructor(private token: TokenStorage) {}
  isUserLogged(): boolean {
    const token = this.token.getToken();
    if (token === null || token === 'null') {
      return false;
    }
    const helper = new JwtHelperService();
    if (helper.isTokenExpired(token)) {
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isOwner(): boolean {
    return this.hasRole('OWNER');
  }

  isClient(): boolean {
    return this.hasRole('CLIENT');
  }

  hasRole(role: string): boolean {
    const token = this.token.getToken();
    if (!this.isUserLogged()) {
      return false;
    }
    const decodedToken = new JwtHelperService().decodeToken(token);
    return decodedToken['scopes'][0].authority.toString() === role;
  }

  logoutUser() {
    this.token.disposeToken();
  }
}
