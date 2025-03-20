import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Home } from '../models/home.type';

const API_URL = 'http://localhost:3000/homes';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  homes = signal<Home[]>([]);
  favoritesHomes = computed(() =>
    this.homes().filter((home) => home.isFavorite)
  );
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private favoritesId: number[] = [];

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

  getAllHomes() {
    this.isLoading.set(true);
    this.http.get<Home[]>(API_URL).subscribe({
      next: (homes) => {
        this.homes.set(this.addFavoriteStatus(homes));
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.isLoading.set(false);
      },
    });
  }

  toggleFavorite(homeId: number) {
    if (this.favoritesId.includes(homeId)) {
      this.favoritesId = this.favoritesId.filter((id) => id !== homeId);
    } else {
      this.favoritesId = [...this.favoritesId, homeId];
    }
    this.saveFavoritesToStorage();
    this.homes.update((homes) =>
      homes.map((home) => ({
        ...home,
        isFavorite: home.id === homeId ? !home.isFavorite : home.isFavorite,
      }))
    );
  }

  private loadFavoritesFromStorage(): void {
    const storedFavorites = localStorage.getItem('favorites');
    this.favoritesId = storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  private addFavoriteStatus(homes: Home[]): Home[] {
    return homes.map((home) => ({
      ...home,
      isFavorite: home.id ? this.favoritesId.includes(home.id) : false,
    }));
  }

  private saveFavoritesToStorage(): void {
    try {
      localStorage.setItem('favorites', JSON.stringify(this.favoritesId));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }
}
