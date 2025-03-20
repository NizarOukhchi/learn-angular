import { Component } from '@angular/core';
import { HomeCardComponent } from "./components/home-card/home-card.component";
import { Home } from './models/home.type';
import { HomeService } from './services/home.service';

@Component({
  selector: 'app-root',
  imports: [HomeCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HomeListings';

  // This is a Temporary Affected Code

  constructor(private homeService: HomeService) {}

  homes?: Home[];

  ngOnInit(): void {
    this.homeService.getHomes().subscribe(data => {
      this.homes = data;
    });
  }
}