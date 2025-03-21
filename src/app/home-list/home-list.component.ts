import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../services/home.service';
import { Home } from '../models/home.type';
import { FavoriteHomesComponent } from '../favorite-homes/favorite-homes.component';
import { HomesGridComponent } from '../homes-grid/homes-grid.component';

@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [HomesGridComponent, FavoriteHomesComponent],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.css',
})
export class HomeListComponent {
  homeService = inject(HomeService);
  homes: Home[] = [];
  favoriteIds: number[] = [];

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  ngOnInit() {
    this.homeService.getHomes().subscribe((homes) => {
      this.homes = this.addFavoritesToHomes(homes);
    });
  }

  toggleFavorite(homeId: number) {
    if (this.favoriteIds.includes(homeId)) {
      this.favoriteIds = this.favoriteIds.filter((id) => id !== homeId);
    } else {
      this.favoriteIds = [...this.favoriteIds, homeId];
    }
    this.saveFavoritesToLocalStorage();
    this.homes = this.addFavoritesToHomes(this.homes);
  }

  private addFavoritesToHomes(homes: Home[]) {
    return homes.map((home) => ({
      ...home,
      isFavorite: home.id ? this.favoriteIds.includes(home.id) : false,
    }));
  }

  private loadFavoritesFromLocalStorage() {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      this.favoriteIds = JSON.parse(favorites);
    }
  }

  private saveFavoritesToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(this.favoriteIds));
  }
}
