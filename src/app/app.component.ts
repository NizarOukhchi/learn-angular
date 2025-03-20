import { Component } from '@angular/core';
import { HomeCardComponent } from "./components/home-card/home-card.component";
import { Home } from './models/home.type';
import { HomeService } from './services/home.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HomeListings';
}