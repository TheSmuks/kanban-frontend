import { Component } from '@angular/core';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  enviroment = environment;
}
