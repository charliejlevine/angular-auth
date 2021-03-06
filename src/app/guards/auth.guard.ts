import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  user$: Observable<User | null>;

  constructor(authService: AuthService, private router: Router) {
    this.user$ = authService.user$;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.user$.pipe(
      map((user) => {
        const isAuthorized = !!user;
        const isLoginRoute = state.url.includes('login');
        const hasAccess = isLoginRoute ? !isAuthorized : isAuthorized;
        const redirect = isLoginRoute
          ? this.router.createUrlTree([''])
          : this.router.createUrlTree(['login']);
        return hasAccess ? true : redirect;
      })
    );
  }
}
