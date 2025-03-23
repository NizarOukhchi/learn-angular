import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Home } from '../models/home.type';

const API_URL = 'http://localhost:3000';

type PaginatedResponse<T> = {
  data: T[];
  pages: number;
  items: number;
};

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  http = inject(HttpClient);
  paginatedHomes = signal<Home[]>([]);
  totalPages = signal<number>(0);
  totalItems = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  favoritesHomes = signal<Home[]>([]);

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  fetchHomes(page: number = 1, limit: number = 6) {
    this.isLoading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_per_page', limit.toString());

    return this.http
      .get<PaginatedResponse<Home>>(`${API_URL}/homes`, {
        params,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.paginatedHomes.set(this.addToFavoritesStatus(response.data));
          this.totalPages.set(response.pages);
          this.totalItems.set(response.items);
        },
        error: (error) => {
          this.error.set(error.message);
        },
      });
  }

  toggleFavorite(home: Home) {
    if (this.favoritesHomes().some((h) => h.id === home.id)) {
      this.favoritesHomes.update((homes) =>
        homes.filter((h) => h.id !== home.id)
      );
    } else {
      this.favoritesHomes.update((homes) => [
        ...homes,
        { ...home, isFavorite: true },
      ]);
    }
    this.paginatedHomes.update((homes) =>
      homes.map((h) => {
        if (h.id === home.id) {
          return { ...h, isFavorite: !h.isFavorite };
        }
        return h;
      })
    );
    this.saveFavoritesToLocalStorage();
  }

  private addToFavoritesStatus(homes: Home[]): Home[] {
    return homes.map((home) => ({
      ...home,
      isFavorite: this.favoritesHomes().some((h) => h.id === home.id),
    }));
  }

  private saveFavoritesToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(this.favoritesHomes()));
  }

  private loadFavoritesFromLocalStorage() {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      this.favoritesHomes.set(JSON.parse(favorites));
    }
  }
}
