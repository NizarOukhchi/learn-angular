import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeCardComponent } from './home-card/home-card.component';
import { Home } from './models/home.type';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'HomeListings';

  home: Home = {
    title: 'Beautiful Family Home',
    description:
      'Spacious family home with a large backyard and modern amenities.',
    city: 'San Francisco',
    rooms: 4,
    bathrooms: 2,
    hasPool: true,
    picture:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    id: 1,
  };
}
