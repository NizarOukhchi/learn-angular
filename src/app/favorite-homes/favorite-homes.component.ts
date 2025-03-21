import { Component, inject } from '@angular/core';
import { HomeCardComponent } from '../home-card/home-card.component';
import { HomeService } from "../services/home.service";

@Component({
  selector: 'app-favorite-homes',
  imports: [HomeCardComponent],
  templateUrl: './favorite-homes.component.html',
  styleUrl: './favorite-homes.component.css'
})
export class FavoriteHomesComponent {
  homeService = inject(HomeService);
  favoriteHomes = this.homeService.favoritesHomes;
}
