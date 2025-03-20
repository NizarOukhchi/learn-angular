# Angular Homes App - Day 3 Tutorial

## Description

This is the take-home exercise for Day 3. Today, you'll build on your progress from Days 1 and 2 by implementing pagination and filtering features to enhance the user experience. You'll learn how to create reusable components and how to implement more advanced API interactions.

### Objectives:

- Enhance the home service to support pagination
- Create a reusable pagination component
- Implement a filter component for searching and filtering homes
- Handle advanced state management with signals
- Improve user experience with responsive design

### What You'll Build:

By the end of this tutorial, your application will allow users to navigate through pages of home listings and filter results based on different criteria such as number of rooms, bathrooms, and location. These features will make your application more user-friendly and practical.

Let's get started!

## Step 1: Enhance the Home Service for Pagination

First, let's modify our home service to support pagination when fetching data from the API.

### Update the Home Service

Modify `home.service.ts` to handle pagination parameters:

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, tap } from "rxjs";
import { Home } from "../models/home";
import { signal } from "@angular/core";

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
}

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private apiUrl = "http://localhost:3000/homes";

  // Define signals for state management
  private homesSignal = signal<Home[]>([]);
  private isLoadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private paginationDataSignal = signal<PaginationData | null>(null);

  // Expose readonly signals
  readonly homes = this.homesSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly paginationData = this.paginationDataSignal.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Fetch homes with pagination and optional filters
   * @param page The page number to fetch
   * @param limit Number of items per page
   * @param filters Optional filters to apply
   */
  fetchHomes(page: number = 1, limit: number = 6, filters: Record<string, any> = {}): Observable<Home[]> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    // Create query parameters
    const params: Record<string, string> = {
      _page: page.toString(),
      _limit: limit.toString(),
    };

    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params[key] = value.toString();
      }
    });

    // Make the request with pagination parameters
    return this.http
      .get<Home[]>(this.apiUrl, {
        params,
        observe: "response", // Get full response to access headers
      })
      .pipe(
        map((response) => {
          const homes = response.body || [];

          // Extract total count from headers and calculate pagination data
          const totalCount = response.headers.get("X-Total-Count");
          if (totalCount) {
            const total = parseInt(totalCount, 10);
            const totalPages = Math.ceil(total / limit);

            this.paginationDataSignal.set({
              total,
              pages: totalPages,
              currentPage: page,
            });
          }

          // Update signals
          this.homesSignal.set(homes);
          this.isLoadingSignal.set(false);

          return homes;
        }),
        // Error handling
        tap({
          error: (err) => {
            this.errorSignal.set("Failed to load homes. Please try again.");
            this.isLoadingSignal.set(false);
            console.error("Error fetching homes:", err);
          },
        })
      );
  }

  /**
   * Get all unique cities from the database
   * Used for filtering options
   */
  getAllCities(): Observable<string[]> {
    return this.http.get<Home[]>(`${this.apiUrl}`).pipe(
      map((homes) => {
        // Extract unique cities
        const citiesSet = new Set(homes.map((home) => home.city));
        return Array.from(citiesSet).sort();
      })
    );
  }
}
```

## Step 2: Create a Pagination Component

Now let's create a reusable pagination component that we can use throughout our application.

### 1. Generate the Pagination Component

```bash
ng generate component components/pagination
```

### 2. Implement the Pagination Component

First, let's update the TypeScript file:

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.css",
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  // Calculated array of page numbers to display
  get pages(): number[] {
    const visiblePages = 5; // Number of page buttons to show
    const pages: number[] = [];

    // Logic to show pages centered around current page
    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + visiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Change to the previous page if possible
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  /**
   * Change to the next page if possible
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  /**
   * Go to a specific page
   */
  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
```

Now, let's create the template for our pagination component:

```html
<div class="flex justify-center items-center space-x-2" *ngIf="totalPages > 1">
  <!-- Previous page button -->
  <button (click)="prevPage()" [disabled]="currentPage === 1" [class.opacity-50]="currentPage === 1" [class.cursor-not-allowed]="currentPage === 1" class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition" aria-label="Previous page">Previous</button>

  <!-- Page number buttons -->
  <div class="flex space-x-1">
    @for (page of pages; track page) {
    <button (click)="goToPage(page)" [class.bg-indigo-600]="page === currentPage" [class.text-white]="page === currentPage" [class.bg-gray-200]="page !== currentPage" [class.hover:bg-gray-300]="page !== currentPage" class="px-3 py-1 rounded transition">{{ page }}</button>
    }
  </div>

  <!-- Next page button -->
  <button (click)="nextPage()" [disabled]="currentPage === totalPages" [class.opacity-50]="currentPage === totalPages" [class.cursor-not-allowed]="currentPage === totalPages" class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition" aria-label="Next page">Next</button>
</div>
```

## Step 3: Create a Filter Component

Let's create a component that allows users to filter homes based on different criteria.

### 1. Generate the Filter Component

```bash
ng generate component components/filter
```

### 2. Create a Filter Options Interface

First, let's define an interface for our filter options. Create a new file `src/app/models/filter-options.ts`:

```typescript
/**
 * Interface for filter options
 */
export interface FilterOptions {
  rooms: number | null;
  bathrooms: number | null;
  hasPool: boolean | null;
  city: string;
}
```

### 3. Implement the Filter Component

Update the filter component TypeScript file:

```typescript
import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HomeService } from "../../services/home.service";
import { FilterOptions } from "../../models/filter-options";

@Component({
  selector: "app-filter",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./filter.component.html",
  styleUrl: "./filter.component.css",
})
export class FilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<FilterOptions>();

  private homeService = inject(HomeService);

  // Filter state
  filters: FilterOptions = {
    rooms: null,
    bathrooms: null,
    hasPool: null,
    city: "",
  };

  // Options for select lists
  cities: string[] = [];
  roomOptions = [1, 2, 3, 4, 5, 6];
  bathroomOptions = [1, 2, 3, 4];

  ngOnInit(): void {
    // Load cities for the city filter
    this.loadCities();
  }

  /**
   * Load all available cities from the API
   */
  loadCities(): void {
    this.homeService.getAllCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => {
        console.error("Error loading cities:", err);
      },
    });
  }

  /**
   * Apply the current filters
   */
  applyFilters(): void {
    this.filterChange.emit(this.filters);
  }

  /**
   * Reset all filters to default values
   */
  resetFilters(): void {
    this.filters = {
      rooms: null,
      bathrooms: null,
      hasPool: null,
      city: "",
    };
    this.filterChange.emit(this.filters);
  }

  /**
   * Toggle the pool filter
   */
  togglePoolFilter(): void {
    // Cycle through true, false, null states
    if (this.filters.hasPool === null) {
      this.filters.hasPool = true;
    } else if (this.filters.hasPool === true) {
      this.filters.hasPool = false;
    } else {
      this.filters.hasPool = null;
    }
  }

  /**
   * Get the label for the pool filter button
   */
  getPoolFilterLabel(): string {
    if (this.filters.hasPool === null) {
      return "Pool: Any";
    } else if (this.filters.hasPool) {
      return "Pool: Yes";
    } else {
      return "Pool: No";
    }
  }
}
```

Now, let's create the template for our filter component:

```html
<div class="bg-white p-4 rounded-lg shadow-md mb-6">
  <h2 class="text-lg font-semibold mb-4">Filter Homes</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- City filter -->
    <div>
      <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
      <select id="city" [(ngModel)]="filters.city" class="w-full p-2 border border-gray-300 rounded">
        <option value="">Any city</option>
        @for (city of cities; track city) {
        <option [value]="city">{{ city }}</option>
        }
      </select>
    </div>

    <!-- Rooms filter -->
    <div>
      <label for="rooms" class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
      <select id="rooms" [(ngModel)]="filters.rooms" class="w-full p-2 border border-gray-300 rounded">
        <option [ngValue]="null">Any</option>
        @for (option of roomOptions; track option) {
        <option [value]="option">{{ option }}+</option>
        }
      </select>
    </div>

    <!-- Bathrooms filter -->
    <div>
      <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
      <select id="bathrooms" [(ngModel)]="filters.bathrooms" class="w-full p-2 border border-gray-300 rounded">
        <option [ngValue]="null">Any</option>
        @for (option of bathroomOptions; track option) {
        <option [value]="option">{{ option }}+</option>
        }
      </select>
    </div>

    <!-- Pool filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Pool</label>
      <button (click)="togglePoolFilter()" class="w-full p-2 border border-gray-300 rounded text-left" [class.bg-indigo-100]="filters.hasPool !== null" [class.border-indigo-500]="filters.hasPool !== null">{{ getPoolFilterLabel() }}</button>
    </div>
  </div>

  <!-- Filter action buttons -->
  <div class="flex justify-end space-x-2 mt-4">
    <button (click)="resetFilters()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition">Reset</button>
    <button (click)="applyFilters()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">Apply Filters</button>
  </div>
</div>
```

## Step 4: Integrate Components in the Home List

Now let's update the HomeListComponent to use our new pagination and filter components:

### 1. Update the Home List Component

Modify `home-list.component.ts`:

```typescript
import { Component, OnInit, computed, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeService } from "../../services/home.service";
import { HomeCardComponent } from "../home-card/home-card.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { FilterComponent } from "../filter/filter.component";
import { FilterOptions } from "../../models/filter-options";
import { Home } from "../../models/home";

@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [CommonModule, HomeCardComponent, PaginationComponent, FilterComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent implements OnInit {
  private homeService = inject(HomeService);

  // Pagination state
  private currentPageSignal = signal<number>(1);
  private itemsPerPageSignal = signal<number>(6);

  // Filter state
  private filtersSignal = signal<FilterOptions>({
    rooms: null,
    bathrooms: null,
    hasPool: null,
    city: "",
  });

  // Favorite state (from Day 2)
  private favoritesSignal = signal<number[]>([]);

  // Expose readonly signals
  readonly currentPage = this.currentPageSignal.asReadonly();
  readonly itemsPerPage = this.itemsPerPageSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();
  readonly favorites = this.favoritesSignal.asReadonly();

  // Computed value for total pages
  readonly totalPages = computed(() => this.homeService.paginationData()?.pages || 0);

  constructor() {
    // Load favorites from localStorage (from Day 2)
    this.loadFavoritesFromStorage();

    // Effect to reload homes when pagination or filters change
    effect(() => {
      this.loadHomes(this.currentPageSignal(), this.itemsPerPageSignal(), this.filtersSignal());
    });
  }

  ngOnInit(): void {
    // Initial load is handled by the effect
  }

  /**
   * Load homes with pagination and filters
   */
  loadHomes(page: number, limit: number, filters: FilterOptions): void {
    this.homeService.fetchHomes(page, limit, filters).subscribe({
      next: (homes) => {
        // Apply favorite status to homes from Day 2
        const homesWithFavorites = this.addFavoriteStatus(homes);
        this.homeService["homesSignal"].set(homesWithFavorites);
      },
    });
  }

  /**
   * Add favorite status to homes based on favorites signal
   * (From Day 2)
   */
  private addFavoriteStatus(homes: Home[]): Home[] {
    const favorites = this.favoritesSignal();

    return homes.map((home) => ({
      ...home,
      isFavorite: home.id ? favorites.includes(home.id) : false,
    }));
  }

  /**
   * Handle page change event from pagination component
   */
  onPageChange(page: number): void {
    this.currentPageSignal.set(page);
  }

  /**
   * Handle filter change event from filter component
   */
  onFilterChange(filters: FilterOptions): void {
    this.filtersSignal.set(filters);
    // Reset to first page when filters change
    this.currentPageSignal.set(1);
  }

  /**
   * Handle favorite toggle from home card
   * (From Day 2)
   */
  onToggleFavorite(homeId: number): void {
    const currentFavorites = this.favoritesSignal();
    const index = currentFavorites.indexOf(homeId);

    if (index === -1) {
      // Add to favorites
      this.favoritesSignal.update((favorites) => [...favorites, homeId]);
    } else {
      // Remove from favorites
      this.favoritesSignal.update((favorites) => favorites.filter((id) => id !== homeId));
    }

    // Update homes with new favorite status
    const updatedHomes = this.addFavoriteStatus(this.homeService.homes());
    this.homeService["homesSignal"].set(updatedHomes);

    // Save to localStorage
    this.saveFavoritesToStorage();
  }

  /**
   * Load favorites from localStorage
   * (From Day 2)
   */
  private loadFavoritesFromStorage(): void {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        if (Array.isArray(favorites)) {
          this.favoritesSignal.set(favorites);
        }
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    }
  }

  /**
   * Save favorites to localStorage
   * (From Day 2)
   */
  private saveFavoritesToStorage(): void {
    try {
      localStorage.setItem("favorites", JSON.stringify(this.favoritesSignal()));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }
}
```

### 2. Update the Home List Template

Modify `home-list.component.html`:

```html
<div class="container mx-auto p-4">
  <!-- Filter component -->
  <app-filter (filterChange)="onFilterChange($event)"></app-filter>

  <!-- Loading state -->
  @if (homeService.isLoading()) {
  <div class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
  }

  <!-- Error state -->
  @else if (homeService.error()) {
  <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
    <p>{{ homeService.error() }}</p>
  </div>
  }

  <!-- Homes grid -->
  @else {
  <!-- Homes listing -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    @for (home of homeService.homes(); track home.id) {
    <app-home-card [home]="home" (toggleFavorite)="onToggleFavorite($event)"></app-home-card>
    } @empty {
    <div class="col-span-3 text-center py-12">
      <p class="text-gray-500">No homes found that match your criteria</p>
      <button (click)="onFilterChange({rooms: null, bathrooms: null, hasPool: null, city: ''})" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Reset Filters</button>
    </div>
    }
  </div>

  <!-- Pagination component -->
  <app-pagination [currentPage]="currentPage()" [totalPages]="totalPages()" (pageChange)="onPageChange($event)"></app-pagination>
  }
</div>
```

## Step 5: Test Your Application

### 1. Start the JSON Server and Angular App

```bash
# Terminal 1
npm run server

# Terminal 2
npm run start
```

### 2. Navigate to Your Application

Open your browser and go to http://localhost:4300 to see your enhanced application with pagination and filtering!

## Understanding the Implementation

### Pagination with JSON Server

JSON Server provides built-in support for pagination using the `_page` and `_limit` parameters. The server also returns a `X-Total-Count` header that we can use to calculate the total number of pages.

### Component Communication

In this implementation, we've created:

1. **Pagination Component**: A reusable component that handles page navigation
2. **Filter Component**: A component for applying filters to the home listings
3. **Integration with HomeListComponent**: Managing the state and coordinating between components

### State Management with Signals

We're using Angular's signals for reactive state management:

- **Signals**: We define signals for the current page, items per page, filters, and favorites
- **Effects**: We use effects to reload homes when pagination or filters change
- **Computed Values**: We compute values like total pages based on other signals

## Bonus Challenge

Now that you have a working pagination and filter system, try implementing these additional features:

1. Add URL parameters that reflect the current pagination and filter state
2. Implement a "sort by" feature that allows users to sort by price, number of rooms, etc.
3. Create a "favorites" filter that shows only favorited homes (using the functionality from Day 2)

## Additional Resources

- [Angular Signal Documentation](https://angular.dev/guide/signals)
- [Angular Routing and Navigation](https://angular.dev/guide/routing)
- [JSON Server Documentation](https://github.com/typicode/json-server)
- [Angular FormModule Documentation](https://angular.dev/guide/forms)
