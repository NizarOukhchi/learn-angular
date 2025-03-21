import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { Home } from '../models/home.type';
import { SortState } from '../models/sort.type';

const API_URL = 'http://localhost:3000';

type PaginatedResponse<T> = {
  data: T;
  pages: number;
  items: number;
};

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _homes = signal<Home[]>([]);
  private _currentSort = signal<SortState>({
    field: 'city',
    direction: 'asc'
  });

  paginatedHomes = computed(() => {
    const homes = this._homes();
    const sort = this._currentSort();

    if (!sort.field) {
      return homes;
    }

    return [...homes].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }

      return sort.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue), undefined, { 
            numeric: true, 
            sensitivity: 'base' 
          })
        : String(bValue).localeCompare(String(aValue), undefined, { 
            numeric: true, 
            sensitivity: 'base' 
          });
    });
  });

  favoritesHomes = computed(() => this._homes().filter(home => home.isFavorite));
  totalHomes = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private favoritesId: number[] = [];

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

  private loadFavoritesFromStorage(): void {
    const storedFavorites = localStorage.getItem("favorites");
    this.favoritesId = storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  getHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(`${API_URL}/homes`);
  }
  

  private addFavoriteStatus(homes: Home[]): Home[] {
    return homes.map((home) => ({
      ...home,
      isFavorite: home.id ? this.favoritesId.includes(home.id) : false,
    }));
  }

  private saveFavoritesToStorage(): void {
    try {
      localStorage.setItem("favorites", JSON.stringify(this.favoritesId));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }

  toggleFavorite(homeId: number) {
    if (this.favoritesId.includes(homeId)) {
      this.favoritesId = this.favoritesId.filter(id => id !== homeId);
    } else {
      this.favoritesId = [...this.favoritesId, homeId];
    }
    
    this.saveFavoritesToStorage();
    
    this._homes.update(homes =>
      homes.map(home => ({
        ...home,
        isFavorite: home.id === homeId ? !home.isFavorite : home.isFavorite
      }))
    );
  }

  updateSort(sortState: SortState) {
    console.log('Nouveau tri appliqué:', sortState);
    this._currentSort.set(sortState);
  }

  fetchHomes(page: number = 1, limit: number = 6) {
    const params = new HttpParams()
      .set("_page", page.toString())
      .set("_per_page", limit.toString());

    this.isLoading.set(true);
    this.error.set(null);

    return this.http
      .get<PaginatedResponse<Home[]>>(`${API_URL}/homes`, { params })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const homesWithFavorites = response.data.map(home => ({
            ...home,
            isFavorite: this.favoritesId.includes(home.id || 0)
          }));
          
          this._homes.set(homesWithFavorites);
          this.totalHomes.set(response.items);
          this.totalPages.set(response.pages);
        },
        error: (error) => {
          this.error.set(error.message);
        },
      });
  }

}
