import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']).then();
    });
  }

  showLoginAndSignupTabs(): boolean {
    return !this.authService.isLoggedIn();
  }

  getUserRole(): string{
    return this.authService.getUserRole()!!;
  }

  getUserFullName(): string{
    return this.authService.getFullName()!!;
  }
}
