import { Component, inject } from '@angular/core';
import { HomeService } from '../services/home.service';
import { HomeCardComponent } from '../home-card/home-card.component';
import { Home } from '../models/home.type';

@Component({
  selector: 'app-favorite-homes',
  imports: [HomeCardComponent],
  templateUrl: './favorite-homes.component.html',
  styleUrl: './favorite-homes.component.css',
})
export class FavoriteHomesComponent {
  homeService = inject(HomeService);
  favoriteHomes = this.homeService.favoritesHomes;
}
