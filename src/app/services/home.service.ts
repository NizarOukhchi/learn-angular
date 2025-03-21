import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Home } from '../models/home.type';
import { finalize } from 'rxjs/operators';
const API_URL = 'http://localhost:3000/homes';

type PaginatedResponse<T> = {
  data: T;
  pages: number;
  items: number;
};

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  paginatedHomes = signal<Home[]>([]);
  favoritesHomes = computed(() =>
    this.paginatedHomes().filter((home) => home.isFavorite)
  );
  totalHomes = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private favoritesId: number[] = [];

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

  fetchHomes(page: number = 1, limit: number = 6) {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_per_page', limit.toString());

    this.isLoading.set(true);
    return this.http
      .get<PaginatedResponse<Home[]>>(API_URL, { params })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.paginatedHomes.set(this.addFavoriteStatus(response.data));
          this.totalHomes.set(response.items);
          this.totalPages.set(response.pages);
        },
        error: (error) => {
          this.error.set(error.message);
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
    this.paginatedHomes.update((homes) =>
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
