# Angular Homes App - Day 4 Tutorial

## Description

This is the take-home exercise for Day 4. Today, you'll build on your Day 3 progress by adding filtering capabilities and implementing forms to create and update home listings. You'll learn about Angular's reactive forms, advanced routing techniques, and how to implement CRUD operations with a REST API.

### Objectives:

- Create a filter component for filtering homes by multiple criteria
- Update the service layer to support filtering
- Implement reactive forms for creating and editing home listings
- Add routing for create/edit functionality
- Learn about form validation in Angular
- Apply Angular's newest features and best practices

### What You'll Build:

By the end of this tutorial, your application will have:

- A filter interface that allows filtering by city, rooms, bathrooms, and pool availability
- Create and update functionality with form validation
- Enhanced routing with parameters
- A more complete service layer with CRUD operations

Let's get started!

## Step 1: Create a Filter Component

First, let's create a component that allows users to filter homes by various criteria.

### 1. Generate the Filter Component

```bash
ng generate component filter-homes
```

### 2. Create a Filter Interface

Create a new file `src/app/models/filter.type.ts`:

```typescript
export interface HomeFilter {
  city?: string;
  rooms?: number;
  bathrooms?: number;
  hasPool?: boolean;
}
```

### 3. Implement the Filter Component

Update `filter-homes.component.ts`:

```typescript
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HomeFilter } from "../models/filter.type";
import { HomeService } from "../services/home.service";

@Component({
  selector: "app-filter-homes",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./filter-homes.component.html",
  styleUrl: "./filter-homes.component.css",
})
export class FilterHomesComponent {
  homeService = inject(HomeService);

  // Available options
  cities = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle", "Denver"];
  roomOptions = [1, 2, 3, 4, 5, 6];
  bathroomOptions = [1, 2, 3, 4, 5];
  poolOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  // Filter model
  filter = signal<HomeFilter>({});

  // Track whether the filter has been applied
  isFilterApplied = signal(false);

  applyFilter(): void {
    this.isFilterApplied.set(true);
    this.homeService.setFilter(this.filter());
    this.homeService.fetchHomes(1); // Reset to first page when filter changes
  }

  clearFilter(): void {
    this.filter.set({});
    this.isFilterApplied.set(false);
    this.homeService.setFilter({});
    this.homeService.fetchHomes(1);
  }

  updateFilter(key: keyof HomeFilter, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filter.update((current) => ({
      ...current,
      [key]: value === "" ? undefined : value,
    }));
  }
}
```

Update `filter-homes.component.html`:

```html
<div class="bg-white rounded-lg shadow p-6 mb-8">
  <h2 class="text-xl font-semibold mb-4">Filter Homes</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- City filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
      <select class="w-full p-2 border rounded" [value]="filter().city || ''" (change)="updateFilter('city', $event)">
        <option value="">All Cities</option>
        @for (city of cities; track city) {
        <option [value]="city">{{ city }}</option>
        }
      </select>
    </div>

    <!-- Rooms filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
      <select class="w-full p-2 border rounded" [value]="filter().rooms || ''" (change)="updateFilter('rooms', $event)">
        <option value="">Any</option>
        @for (room of roomOptions; track room) {
        <option [value]="room">{{ room }}+</option>
        }
      </select>
    </div>

    <!-- Bathrooms filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
      <select class="w-full p-2 border rounded" [value]="filter().bathrooms || ''" (change)="updateFilter('bathrooms', $event)">
        <option value="">Any</option>
        @for (bathroom of bathroomOptions; track bathroom) {
        <option [value]="bathroom">{{ bathroom }}+</option>
        }
      </select>
    </div>

    <!-- Pool filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Swimming Pool</label>
      <select class="w-full p-2 border rounded" [value]="filter().hasPool === undefined ? '' : filter().hasPool" (change)="updateFilter('hasPool', $event)">
        <option value="">Any</option>
        @for (option of poolOptions; track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    </div>
  </div>

  <!-- Filter actions -->
  <div class="flex justify-end mt-4 space-x-2">
    <button (click)="clearFilter()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" [disabled]="!isFilterApplied()">Clear Filters</button>
    <button (click)="applyFilter()" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer">Apply Filters</button>
  </div>
</div>
```

## Step 2: Update the Home Service for Filtering

Now let's update the home service to handle filtering.

### 1. Modify the Home Service

Update `home.service.ts` to support filtering:

```typescript
import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { finalize } from "rxjs/operators";
import { Home } from "../models/home.type";
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
```

## Step 3: Update the App Component with Add Home Button

Let's update the App Component to include the "Add Home" button in the header.

### 1. Update the App Component Template

Update `app.component.html` to include an "Add Home" button in the header:

```html
<!-- Main application container with Tailwind CSS styling -->
<div class="min-h-screen bg-gray-100 flex flex-col">
  <!-- Header section with app title and navigation -->
  <header class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <!-- App title with link to home page -->
        <h1 class="text-2xl font-bold text-indigo-600">
          <a routerLink="/">HomeListings</a>
        </h1>
        <!-- Navigation button to create a new home listing -->
        <button routerLink="/homes/new" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Add New Home</button>
      </div>
    </div>
  </header>

  <!-- Main content area for router outlet -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Router outlet where components will be rendered based on the current route -->
    <router-outlet></router-outlet>
  </main>

  <!-- Footer section -->
  <footer class="bg-white shadow-inner py-6 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-gray-500">&copy; 2025 HomeListings</p>
    </div>
  </footer>
</div>
```

### 2. Update the App Component

Update `app.component.ts` to import and use RouterLink:

```typescript
import { Component } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "angular-homes";
}
```

## Step 4: Update the Home List Component to Include the Filter

Now let's update the HomeListComponent to include our new filter component.

Update `home-list.component.ts`:

```typescript
import { Component } from "@angular/core";
import { HomeGridComponent } from "../home-grid/home-grid.component";
import { FavoriteHomesComponent } from "../favorite-homes/favorite-homes.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { FilterHomesComponent } from "../filter-homes/filter-homes.component";

@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [HomeGridComponent, FavoriteHomesComponent, PaginationComponent, FilterHomesComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent {}
```

Update `home-list.component.html`:

```html
<div class="flex flex-col gap-8 mx-auto px-4 py-8">
  <!-- Filter component -->
  <app-filter-homes></app-filter-homes>

  <!-- Favorites section -->
  <app-favorite-homes></app-favorite-homes>

  <!-- Homes grid -->
  <app-home-grid></app-home-grid>

  <!-- Pagination -->
  <app-pagination></app-pagination>
</div>
```

## Step 5: Update the Homes Grid Component

Now let's update the HomesGridComponent to display the filtered homes.

Update `homes-grid.component.ts`:

```typescript
import { Component, inject } from "@angular/core";
import { HomeService } from "../services/home.service";
import { HomeCardComponent } from "../home-card/home-card.component";

@Component({
  selector: "app-home-grid",
  standalone: true,
  imports: [HomeCardComponent],
  templateUrl: "./homes-grid.component.html",
  styleUrl: "./homes-grid.component.css",
})
export class HomeGridComponent {
  homeService = inject(HomeService);
  homes = this.homeService.paginatedHomes;
  isLoading = this.homeService.isLoading;
  error = this.homeService.error;

  ngOnInit(): void {
    this.homeService.fetchHomes();
  }
}
```

Update `homes-grid.component.html`:

```html
<div class="w-full mx-auto">
  <h2 class="text-3xl font-bold mb-6">Homes</h2>

  @if (isLoading()) {
  <div class="flex justify-center items-center min-h-[200px]">
    <p class="text-gray-500">Loading homes...</p>
  </div>
  } @else if (error()) {
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    <p>{{ error() }}</p>
  </div>
  } @else {
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @for (home of homes() ; track home.id) {
    <app-home-card [home]="home"></app-home-card>
    } @empty {
    <p class="text-gray-500 col-span-3 text-center py-12">No homes found matching your criteria. Try adjusting your filters.</p>
    }
  </div>
  }
</div>
```

## Step 6: Create a Home Form Component with Reactive Forms

Now, let's create a component for adding and editing homes.

### 1. Generate the Home Form Component

```bash
ng generate component home-form
```

### 2. Implement the Home Form Component with Reactive Forms

Update `home-form.component.ts`:

```typescript
import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HomeService } from "../services/home.service";
import { Home } from "../models/home.type";
import { switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-home-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./home-form.component.html",
  styleUrl: "./home-form.component.css",
})
export class HomeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private homeService = inject(HomeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  homeForm!: FormGroup;
  isEditMode = signal(false);
  homeId = signal<number | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // Available options for city select
  cities = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle", "Denver"];

  ngOnInit(): void {
    // Initialize the form
    this.initForm();

    // Check if we're in edit mode
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get("id");

          if (id && id !== "new") {
            this.isEditMode.set(true);
            this.homeId.set(Number(id));
            return this.homeService.getHomeById(Number(id)).pipe(tap((home) => this.patchFormValues(home)));
          } else {
            this.isEditMode.set(false);
            return of(null);
          }
        })
      )
      .subscribe({
        error: (err) => {
          this.errorMessage.set("Failed to load home data. Please try again.");
          console.error("Error loading home:", err);
        },
      });
  }

  initForm(): void {
    this.homeForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      city: ["", Validators.required],
      rooms: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      bathrooms: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      hasPool: [false],
      picture: ["", [Validators.required, Validators.pattern("https?://.+")]],
    });
  }

  patchFormValues(home: Home): void {
    this.homeForm.patchValue({
      title: home.title,
      description: home.description,
      city: home.city,
      rooms: home.rooms,
      bathrooms: home.bathrooms,
      hasPool: home.hasPool,
      picture: home.picture,
    });
  }

  onSubmit(): void {
    if (this.homeForm.invalid) {
      this.homeForm.markAllAsTouched();
      return;
    }

    const homeData = this.homeForm.value;
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    if (this.isEditMode() && this.homeId()) {
      // Update existing home
      this.homeService.updateHome(this.homeId()!, homeData).subscribe({
        next: () => {
          this.router.navigate(["/homes"]);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set("Failed to update home. Please try again.");
          console.error("Error updating home:", err);
        },
      });
    } else {
      // Create new home
      this.homeService.createHome(homeData).subscribe({
        next: () => {
          this.router.navigate(["/homes"]);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set("Failed to create home. Please try again.");
          console.error("Error creating home:", err);
        },
      });
    }
  }

  // Getters for form controls to make the template cleaner
  get title() {
    return this.homeForm.get("title");
  }
  get description() {
    return this.homeForm.get("description");
  }
  get city() {
    return this.homeForm.get("city");
  }
  get rooms() {
    return this.homeForm.get("rooms");
  }
  get bathrooms() {
    return this.homeForm.get("bathrooms");
  }
  get picture() {
    return this.homeForm.get("picture");
  }
}
```

Update `home-form.component.html`:

```html
<div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <h1 class="text-2xl font-bold mb-6">{{ isEditMode() ? 'Edit Home' : 'Add New Home' }}</h1>

  @if (errorMessage()) {
  <div class="mb-4 p-3 bg-red-100 text-red-700 rounded">{{ errorMessage() }}</div>
  }

  <form [formGroup]="homeForm" (ngSubmit)="onSubmit()">
    <!-- Title field -->
    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1"> Title * </label>
      <input type="text" id="title" formControlName="title" class="w-full p-2 border rounded" [class.border-red-500]="title?.invalid && title?.touched" />
      @if (title?.invalid && title?.touched) {
      <div class="text-red-500 text-sm mt-1">@if (title?.errors?.['required']) { Title is required } @else if (title?.errors?.['minlength']) { Title must be at least 5 characters } @else if (title?.errors?.['maxlength']) { Title cannot exceed 100 characters }</div>
      }
    </div>

    <!-- Description field -->
    <div class="mb-4">
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1"> Description * </label>
      <textarea id="description" formControlName="description" rows="4" class="w-full p-2 border rounded" [class.border-red-500]="description?.invalid && description?.touched"></textarea>
      @if (description?.invalid && description?.touched) {
      <div class="text-red-500 text-sm mt-1">@if (description?.errors?.['required']) { Description is required } @else if (description?.errors?.['minlength']) { Description must be at least 10 characters } @else if (description?.errors?.['maxlength']) { Description cannot exceed 500 characters }</div>
      }
    </div>

    <!-- City field -->
    <div class="mb-4">
      <label for="city" class="block text-sm font-medium text-gray-700 mb-1"> City * </label>
      <select id="city" formControlName="city" class="w-full p-2 border rounded" [class.border-red-500]="city?.invalid && city?.touched">
        <option value="">Select a city</option>
        @for (cityOption of cities; track cityOption) {
        <option [value]="cityOption">{{ cityOption }}</option>
        }
      </select>
      @if (city?.invalid && city?.touched) {
      <div class="text-red-500 text-sm mt-1">City is required</div>
      }
    </div>

    <!-- Rooms and Bathrooms fields in a row -->
    <div class="flex gap-4 mb-4">
      <div class="flex-1">
        <label for="rooms" class="block text-sm font-medium text-gray-700 mb-1"> Bedrooms * </label>
        <input type="number" id="rooms" formControlName="rooms" min="1" max="10" class="w-full p-2 border rounded" [class.border-red-500]="rooms?.invalid && rooms?.touched" />
        @if (rooms?.invalid && rooms?.touched) {
        <div class="text-red-500 text-sm mt-1">@if (rooms?.errors?.['required']) { Number of rooms is required } @else if (rooms?.errors?.['min'] || rooms?.errors?.['max']) { Rooms must be between 1 and 10 }</div>
        }
      </div>

      <div class="flex-1">
        <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-1"> Bathrooms * </label>
        <input type="number" id="bathrooms" formControlName="bathrooms" min="1" max="10" class="w-full p-2 border rounded" [class.border-red-500]="bathrooms?.invalid && bathrooms?.touched" />
        @if (bathrooms?.invalid && bathrooms?.touched) {
        <div class="text-red-500 text-sm mt-1">@if (bathrooms?.errors?.['required']) { Number of bathrooms is required } @else if (bathrooms?.errors?.['min'] || bathrooms?.errors?.['max']) { Bathrooms must be between 1 and 10 }</div>
        }
      </div>
    </div>

    <!-- Has Pool field -->
    <div class="mb-4">
      <label class="flex items-center">
        <input type="checkbox" id="hasPool" formControlName="hasPool" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <span class="ml-2 text-sm text-gray-700">Has Swimming Pool</span>
      </label>
    </div>

    <!-- Picture URL field -->
    <div class="mb-6">
      <label for="picture" class="block text-sm font-medium text-gray-700 mb-1"> Picture URL * </label>
      <input type="text" id="picture" formControlName="picture" class="w-full p-2 border rounded" [class.border-red-500]="picture?.invalid && picture?.touched" placeholder="https://example.com/image.jpg" />
      @if (picture?.invalid && picture?.touched) {
      <div class="text-red-500 text-sm mt-1">@if (picture?.errors?.['required']) { Picture URL is required } @else if (picture?.errors?.['pattern']) { Please enter a valid URL (starting with http:// or https://) }</div>
      }
    </div>

    <!-- Form actions -->
    <div class="flex justify-between">
      <button type="button" routerLink="/homes" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
      <button type="submit" [disabled]="homeForm.invalid || isSubmitting()" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">{{ isSubmitting() ? 'Saving...' : (isEditMode() ? 'Update Home' : 'Create Home') }}</button>
    </div>
  </form>
</div>
```

## Step 5: Update Routing for Home Form

Update `app.routes.ts`:

```typescript
import { Routes } from "@angular/router";
import { HomeListComponent } from "./home-list/home-list.component";
import { HomeFormComponent } from "./home-form/home-form.component";

export const routes: Routes = [
  {
    path: "homes",
    component: HomeListComponent,
  },
  {
    path: "homes/new",
    component: HomeFormComponent,
  },
  {
    path: "homes/:id",
    component: HomeFormComponent,
  },
  {
    path: "",
    redirectTo: "homes",
    pathMatch: "full",
  },
];
```

## Step 6: Update the Home Card Component for Edit Functionality

Let's add an edit button to the HomeCardComponent:

Update `home-card.component.html`:

```html
<div class="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 h-full">
  <!-- Existing code... -->

  <div class="flex flex-col gap-4 p-6">
    <!-- Existing code... -->

    <!-- Add at the bottom of the card -->
    <div class="w-full flex px-2 pb-2 mt-auto">
      <button [routerLink]="['/homes', home.id]" class="w-full px-4 py-2 border bg-indigo-500 text-white rounded hover:bg-indigo-700 cursor-pointer transition-all duration-300">Edit</button>
    </div>
  </div>
</div>
```

Don't forget to add RouterLink to the imports in `home-card.component.ts`:

```typescript
import { Component, Input, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { LucideAngularModule, MapPin, WavesLadder, Bed, Bath, Heart } from "lucide-angular";
import { Home } from "../models/home.type";
import { CommonModule } from "@angular/common";
import { HomeService } from "../services/home.service";

@Component({
  selector: "app-home-card",
  imports: [LucideAngularModule, FormsModule, CommonModule, RouterLink],
  templateUrl: "./home-card.component.html",
  styleUrl: "./home-card.component.css",
})
export class HomeCardComponent {
  // Existing code...
}
```

## Understanding Reactive Forms in Angular

Angular offers two approaches to building forms: Template-driven forms and Reactive forms. In this tutorial, we're using Reactive forms, which provide more flexibility, better testing capabilities, and more direct control over form validation.

### Key Concepts of Reactive Forms:

1. **FormControl**: Represents a single input field and tracks its value and validation state.

   ```typescript
   const nameControl = new FormControl("Initial value", Validators.required);
   ```

2. **FormGroup**: A collection of FormControls that tracks the value and validity state of a group of FormControl instances.

   ```typescript
   this.form = new FormGroup({
     name: new FormControl("", Validators.required),
     email: new FormControl("", [Validators.required, Validators.email]),
   });
   ```

3. **FormBuilder**: A service that provides convenient methods for generating controls.

   ```typescript
   this.form = this.fb.group({
     name: ["", Validators.required],
     email: ["", [Validators.required, Validators.email]],
   });
   ```

4. **Validators**: Functions that check whether the value of a control satisfies a certain condition.

   - `Validators.required`: Field must have a non-empty value
   - `Validators.minLength(n)`: Field must have at least n characters
   - `Validators.maxLength(n)`: Field must have no more than n characters
   - `Validators.pattern(regex)`: Field must match the regular expression
   - `Validators.email`: Field must be a valid email format

5. **Custom Validators**: You can create your own validation functions.

   ```typescript
   function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
     return (control: AbstractControl): { [key: string]: any } | null => {
       const forbidden = nameRe.test(control.value);
       return forbidden ? { forbiddenName: { value: control.value } } : null;
     };
   }
   ```

6. **Form Submission**: The form's value is directly available as a JavaScript object.

   ```typescript
   onSubmit() {
     console.log(this.form.value); // {name: 'John', email: 'john@example.com'}
   }
   ```

7. **Form State**: Reactive forms provide properties to track state:

   - `valid` / `invalid`: Whether the form is valid
   - `pristine` / `dirty`: Whether the user has changed values
   - `touched` / `untouched`: Whether the user has interacted with the control
   - `pending`: Whether async validators are in progress

### Benefits of Reactive Forms:

- **Type Safety**: Better TypeScript integration
- **Synchronous Access**: Immediate access to the form and its controls
- **Predictability**: Form updates follow clear streams and events
- **Testing**: Easy to test in isolation
- **Reusability**: Can be built with reusable components

### When to Use Reactive Forms:

- Complex forms with dynamic controls
- Forms with complex validation rules
- Forms that need to be unit tested
- Applications using a reactive programming approach

## Angular 19 Features and Best Practices

In this tutorial, we've used several modern Angular features:

1. **Standalone Components**: All components are standalone, not part of a module.

2. **Signals**: We use signals for state management (`signal()`, `computed()`).

3. **Control Flow Syntax**: We use the new `@if`, `@for`, `@else` syntax.

4. **Dependency Injection**: We use the `inject()` function instead of constructor injection.

5. **Angular reactive form state tracking**: Form validity and value tracking.

6. **Router Link**: Declarative navigation using `routerLink`.

7. **Reactive Programming**: Using RxJS operators like `switchMap` and `pipe` for handling async data flows.

## Step 7: Test Your Application

### 1. Make sure the JSON server is running:

```bash
npm run server
```

### 2. Start the Angular application:

```bash
npm run start
```

Navigate to http://localhost:4300 and test your new filtering and form functionality.

## Bonus Challenge

Now that you have completed the core functionality, try implementing these additional features:

1. Add sorting capabilities (by city, number of rooms, etc.)
2. Implement image preview in the form
3. Add a delete home functionality
4. Create a detail view page for each home
5. Implement form autosave to localStorage when partly filled

## Additional Resources

- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Angular Signals](https://angular.dev/guide/signals)
- [Form Validation](https://angular.dev/guide/forms/form-validation)
- [Angular Routing](https://angular.dev/guide/routing)
- [RxJS in Angular](https://angular.dev/guide/rxjs)
- [JSON Server Documentation](https://github.com/typicode/json-server)
