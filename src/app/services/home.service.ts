import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { finalize } from "rxjs/operators";
import { Home } from "../models/home";
import { HomeFilter } from "../models/filter.type";
import { Observable } from "rxjs";

const API_URL = "http://localhost:3000";

type PaginatedResponse<T> = {
  data: T[];
  pages: number;
  items: number;
};

@Injectable({
  providedIn: "root",
})
export class HomeService {
  http = inject(HttpClient);
  paginatedHomes = signal<Home[]>([]);
  totalPages = signal<number>(0);
  totalItems = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  favoritesHomes = signal<Home[]>([]);

  // Add filter state
  activeFilter = signal<HomeFilter>({});

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  // Set the filter and update favoritesHomes based on the filter
  setFilter(filter: HomeFilter): void {
    this.activeFilter.set(filter);

    // Also filter the favorites
    const allFavorites = this.loadFavoritesFromLocalStorage();
    const filteredFavorites = this.applyFilterToHomes(allFavorites, filter);
    this.favoritesHomes.set(filteredFavorites);
  }

  fetchHomes(page: number = 1, limit: number = 6) {
    this.isLoading.set(true);
    this.error.set(null);

    let params = new HttpParams().set("_page", page.toString()).set("_per_page", limit.toString());

    // Add filter parameters
    const filter = this.activeFilter();
    if (filter.city) {
      params = params.set("city", filter.city);
    }
    if (filter.rooms) {
      params = params.set("rooms_gte", filter.rooms.toString());
    }
    if (filter.bathrooms) {
      params = params.set("bathrooms_gte", filter.bathrooms.toString());
    }
    if (filter.hasPool !== undefined) {
      params = params.set("hasPool", filter.hasPool.toString());
    }

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

  // Create a new home
  createHome(home: Omit<Home, "id">): Observable<Home> {
    return this.http.post<Home>(`${API_URL}/homes`, home);
  }

  // Update an existing home
  updateHome(id: number, home: Partial<Home>): Observable<Home> {
    return this.http.put<Home>(`${API_URL}/homes/${id}`, home);
  }

  // Get a home by ID
  getHomeById(id: number): Observable<Home> {
    return this.http.get<Home>(`${API_URL}/homes/${id}`);
  }

  toggleFavorite(home: Home) {
    if (this.favoritesHomes().some((h) => h.id === home.id)) {
      this.favoritesHomes.update((homes) => homes.filter((h) => h.id !== home.id));
    } else {
      this.favoritesHomes.update((homes) => [...homes, { ...home, isFavorite: true }]);
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
    localStorage.setItem("favorites", JSON.stringify(this.favoritesHomes()));
  }

  private loadFavoritesFromLocalStorage(): Home[] {
    const favorites = localStorage.getItem("favorites");
    if (favorites) {
      const parsedFavorites = JSON.parse(favorites) as Home[];
      this.favoritesHomes.set(parsedFavorites);
      return parsedFavorites;
    }
    return [];
  }

  // Helper method to apply filter to an array of homes
  private applyFilterToHomes(homes: Home[], filter: HomeFilter): Home[] {
    return homes.filter((home) => {
      if (filter.city && home.city !== filter.city) return false;
      if (filter.rooms && home.rooms < filter.rooms) return false;
      if (filter.bathrooms && home.bathrooms < filter.bathrooms) return false;
      if (filter.hasPool !== undefined && home.hasPool !== filter.hasPool) return false;
      return true;
    });
  }
}