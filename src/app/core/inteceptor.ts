import {
    HttpErrorResponse, HttpEvent,
    HttpHandler,
    HttpHeaderResponse,
    HttpInterceptor,
    HttpProgressEvent,
    HttpRequest,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenStorage } from './token.storage';
import {ToastrService} from 'ngx-toastr';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(private token: TokenStorage, private router: Router, private toastr: ToastrService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        if (this.token.getToken() != null && this.token.getToken() !== 'null') {
            authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, this.token.getToken())});
        }

        return next.handle(authReq)
            .pipe(
                tap((event: HttpEvent<any>) => {
                }),
                catchError((err) => {
                    console.log(err);
                    console.log('req url :: ' + req.url);
                    if (err.status === 401) {
                        this.router.navigate(['login']);
                        this.toastr.error('User account not found.');
                    } else {
                      this.toastr.error('Website is not responding.');
                    }
                    return of(err);
                })
            );

    }


}
