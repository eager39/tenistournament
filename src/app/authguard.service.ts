import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
    token=localStorage.getItem('currentUser');
    helper = new JwtHelperService();
    decodedToken = this.helper.decodeToken(localStorage.getItem("currentUser"));
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.token) {
            // logged in so return true
           
            if(this.helper.isTokenExpired(this.token)){
                localStorage.removeItem("currentUser");
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            }
            return true;
        }
 
        // not logged in so redirect to login page with the return url
        
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}