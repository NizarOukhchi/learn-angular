# Angular Homes App - Day 3 Tutorial

## Description

This is the take-home exercise for Day 3. Today, you'll build on your Day 2 progress by implementing pagination and adding a dedicated favorites section to the homes application. These features will enhance the user experience by making it easier to navigate through large sets of data and quickly access favorite properties.

### Objectives:

- Implement pagination for the homes list
- Create a reusable pagination component
- Create a favorites section to display favorite homes
- Update the service layer to support pagination
- Continue working with Angular signals for reactive state management
- Apply Angular's control flow syntax to the new components
- Implement component-based architecture with parent-child relationships

### What You'll Build:

By the end of this tutorial, your application will have:

- A paginated grid of homes with a user-friendly pagination interface
- A favorites section that displays homes marked as favorites
- A hierarchical component structure that separates concerns

Let's get started!

## Step 1: Update the Home Service for Pagination

First, let's enhance our home service to support pagination.

### 1. Modify the Home Service

Update `home.service.ts` to support pagination:

```typescript
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, computed, signal } from "@angular/core";
import { Home } from "../models/home.type";
import { finalize } from "rxjs/operators";
const API_URL = "http://localhost:3000/homes";

type PaginatedResponse<T> = {
  data: T;
  pages: number;
  items: number;
};

@Injectable({
  providedIn: "root",
})
export class HomeService {
  paginatedHomes = signal<Home[]>([]);
  favoritesHomes = computed(() => this.paginatedHomes().filter((home) => home.isFavorite));
  totalHomes = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private favoritesId: number[] = [];

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

  fetchHomes(page: number = 1, limit: number = 6) {
    let params = new HttpParams().set("_page", page.toString()).set("_per_page", limit.toString());

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
    const storedFavorites = localStorage.getItem("favorites");
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
      localStorage.setItem("favorites", JSON.stringify(this.favoritesId));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }
}
```

The key points to understand about this service:

- The `paginatedHomes` signal stores the current page of homes
- The `favoritesHomes` computed signal filters only favorites from the current homes
- We're using the JSON Server pagination with `_page` and `_per_page` parameters
- We handle loading states and errors with signals
- The response from the server includes the total pages and items count

## Step 2: Create the Component Structure

For our application, we'll create a hierarchical component structure:

1. **HomeListComponent**: The parent component that combines favorites and homes grid
2. **FavoriteHomesComponent**: Displays only favorite homes
3. **HomesGridComponent**: Shows the paginated grid of all homes with pagination
4. **PaginationComponent**: Handles the pagination UI and logic
5. **HomeCardComponent**: Displays a single home card (reused in both FavoritesHome and HomesGrid)

Let's set up each component:

### 1. Update the Home List Component

The HomeListComponent will be the container for both the favorites section and the homes grid:

Update `home-list.component.ts`:

```typescript
import { Component } from "@angular/core";

import { HomesGridComponent } from "../homes-grid/homes-grid.component";
import { FavoriteHomesComponent } from "../favorite-homes/favorite-homes.component";

@Component({
  selector: "app-home-list",
  imports: [HomesGridComponent, FavoriteHomesComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent {}
```

Update `home-list.component.html`:

```html
<div class="flex flex-col gap-8 mx-auto px-4 py-8">
  <app-favorite-homes></app-favorite-homes>
  <app-homes-grid></app-homes-grid>
</div>
```

### 2. Create the Favorite Homes Component

Generate and implement the FavoriteHomesComponent:

```bash
ng generate component favorite-homes
```

Update `favorite-homes.component.ts`:

```typescript
import { Component, inject } from "@angular/core";
import { HomeService } from "../services/home.service";
import { HomeCardComponent } from "../home-card/home-card.component";
import { Home } from "../models/home.type";

@Component({
  selector: "app-favorite-homes",
  imports: [HomeCardComponent],
  templateUrl: "./favorite-homes.component.html",
  styleUrl: "./favorite-homes.component.css",
})
export class FavoriteHomesComponent {
  homeService = inject(HomeService);
  favoriteHomes = this.homeService.favoritesHomes;
}
```

Update `favorite-homes.component.html`:

```html
<div class="w-full mx-auto">
  <h2 class="text-3xl font-bold mb-6">Favorite Homes</h2>
  @if (favoriteHomes().length === 0) {
  <p class="text-gray-500">No favorite homes found.</p>
  } @else {
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @for (home of favoriteHomes(); track home.id) {
    <app-home-card [home]="home"></app-home-card>
    }
  </div>
  }
</div>
```

### 3. Create the Homes Grid Component

Generate and implement the HomesGridComponent:

```bash
ng generate component homes-grid
```

Update `homes-grid.component.ts`:

```typescript
import { Component, inject } from "@angular/core";
import { HomeService } from "../services/home.service";
import { HomeCardComponent } from "../home-card/home-card.component";
import { PaginationComponent } from "../pagination/pagination.component";
@Component({
  selector: "app-homes-grid",
  imports: [HomeCardComponent, PaginationComponent],
  templateUrl: "./homes-grid.component.html",
  styleUrl: "./homes-grid.component.css",
})
export class HomesGridComponent {
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
    <p class="text-gray-500 col-span-3 text-center py-12">No homes found. Please check back later.</p>
    }
  </div>
  }
  <app-pagination></app-pagination>
</div>
```

### 4. Create the Pagination Component

Generate and implement the PaginationComponent:

```bash
ng generate component pagination
```

Update `pagination.component.ts`:

```typescript
import { Component, computed, inject } from "@angular/core";
import { HomeService } from "../services/home.service";

@Component({
  selector: "app-pagination",
  imports: [],
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.css",
})
export class PaginationComponent {
  homeService = inject(HomeService);
  currentPage = 1;
  totalPages = this.homeService.totalPages.asReadonly();
  totalHomes = this.homeService.totalHomes.asReadonly();
  pages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  onPageChange(page: number) {
    this.currentPage = page;
    this.homeService.fetchHomes(page);
  }
}
```

Update `pagination.component.html`:

```html
<div class="flex justify-center mt-8 space-x-2">
  <!-- Previous page button -->
  <button
    [disabled]="currentPage === 1"
    (click)="onPageChange(currentPage - 1)"
    [class]="
      currentPage === 1
        ? 'px-3 py-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer'
    "
  >
    Previous
  </button>

  <!-- Page number buttons -->
  @for (page of pages(); track page) {
  <button
    (click)="onPageChange(page)"
    [class]="
      page === currentPage
        ? 'px-3 py-1 rounded-md bg-indigo-600 text-white'
        : 'px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer'
    "
  >
    {{ page }}
  </button>
  }

  <!-- Next page button -->
  <button
    type="button"
    [disabled]="currentPage === totalPages()"
    (click)="onPageChange(currentPage + 1)"
    [class]="
      currentPage === totalPages()
        ? 'px-3 py-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer'
    "
  >
    Next
  </button>
</div>
```

### 5. Update the Home Card Component

Update the `home-card.component.ts`:

```typescript
import { Component, Input, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, MapPin, WavesLadder, Bed, Bath, Heart } from "lucide-angular";
import { Home } from "../models/home.type";
import { CommonModule } from "@angular/common";
import { HomeService } from "../services/home.service";

@Component({
  selector: "app-home-card",
  imports: [LucideAngularModule, FormsModule, CommonModule],
  templateUrl: "./home-card.component.html",
  styleUrl: "./home-card.component.css",
})
export class HomeCardComponent {
  @Input() home!: Home;
  homeService = inject(HomeService);

  // Icons list
  readonly MapPin = MapPin;
  readonly WavesLadderIcon = WavesLadder;
  readonly BedIcon = Bed;
  readonly BathIcon = Bath;
  readonly HeartIcon = Heart;

  onFavoriteClick(): void {
    if (!this.home.id) {
      return;
    }
    this.homeService.toggleFavorite(this.home.id);
  }
}
```

Update `home-card.component.html`:

```html
<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 h-full">
  <div class="h-48 overflow-hidden relative">
    <img [src]="home.picture" [alt]="home.title" class="w-full h-full object-cover" />
    <!-- Favorite button -->
    <button
      (click)="onFavoriteClick()"
      class="absolute top-2 right-2 p-2 bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all cursor-pointer"
      aria-label="Toggle favorite"
      [ngClass]="{
        'bg-indigo-500': home.isFavorite,
        'bg-white': !home.isFavorite
      }"
    >
      <lucide-icon [img]="HeartIcon" [color]="home.isFavorite ? 'white' : 'gray'" class="w-5 h-5"></lucide-icon>
    </button>
  </div>

  <div class="flex flex-col gap-4 p-6">
    <div class="flex flex-col gap-1">
      <h3 class="text-xl font-semibold text-gray-800">{{ home.title }}</h3>
      <div class="flex gap-1">
        <lucide-icon [img]="MapPin" class="text-gray-400"></lucide-icon>
        <p class="text-gray-400 mb">{{ home.city }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <lucide-icon [img]="BedIcon" class="my-icon" color="indigo"></lucide-icon>
        <span class="text-indigo-900 font-medium">{{ home.rooms }} Bedrooms</span>
      </div>
      <div class="flex items-center gap-2">
        <lucide-icon [img]="BathIcon" class="my-icon" color="indigo"></lucide-icon>
        <span class="text-indigo-900 font-medium">{{ home.bathrooms }} Bathrooms</span>
      </div>
      <div class="flex items-center gap-2">
        <lucide-icon [img]="WavesLadderIcon" class="my-icon" [color]="home.hasPool ? 'blue' : 'gray'"></lucide-icon>
      </div>
    </div>
    <p class="text-gray-700 mb-4">{{ home.description }}</p>
  </div>
</div>
```

### 6. Make sure the Home model is defined

Create or update `models/home.type.ts`:

```typescript
export type Home = {
  id?: number;
  title: string;
  description: string;
  city: string;
  rooms: number;
  bathrooms: number;
  hasPool: boolean;
  picture: string;
  isFavorite?: boolean;
};
```

## Step 3: Update the Routes

Make sure the routes are properly configured in `app.routes.ts`:

```typescript
import { Routes } from "@angular/router";
import { HomeListComponent } from "./home-list/home-list.component";

export const routes: Routes = [
  {
    path: "homes",
    component: HomeListComponent,
  },
  {
    path: "",
    redirectTo: "homes",
    pathMatch: "full",
  },
];
```

## Step 4: Understanding the Component Architecture

Our application follows a hierarchical component architecture:

```
HomeListComponent
│
├── FavoriteHomesComponent
│   └── HomeCardComponent (for each favorite home)
│
└── HomesGridComponent
    ├── HomeCardComponent (for each home)
    └── PaginationComponent
```

This structure has several benefits:

1. **Separation of Concerns**: Each component has a specific responsibility
2. **Reusability**: The HomeCardComponent is reused in multiple places
3. **Maintainability**: Changes to one part of the UI don't affect others
4. **Data Flow**: Data and events flow naturally through the component hierarchy

## Step 5: Understanding Signal-Based State Management

Our application uses Angular's signals for reactive state management. Here's how it works:

1. **Core State in Service**: The HomeService maintains all the core application state
2. **Computed Signals**: We use computed signals to derive values, like filtering favorites
3. **Component-Level State**: Components maintain minimal local state (like currentPage)
4. **Unidirectional Data Flow**: Data flows down from services to components
5. **Event Handlers**: Components call service methods to trigger state changes

This creates a predictable data flow pattern that makes the application easier to understand and debug.

## Step 6: Test Your Application

### 1. Make sure the JSON server is running:

```bash
npm run server
```

### 2. Start the Angular application:

```bash
npm run start
```

Navigate to http://localhost:4300 and test your pagination and favorites functionality.

## Bonus Challenge

Now that you have the basic functionality working, try implementing these additional features:

1. Add sorting capabilities (by number of rooms, city, etc.)
2. Implement a search bar for keyword search
3. Try to manage favorite state in the backend using json-server
4. Try to use local storage to save the whole element
5. Implement skeleton loading states instead of "Loading..." text

## Additional Resources

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Angular Component Architecture](https://angular.dev/guide/components)
- [Angular Routing](https://angular.dev/guide/routing)
- [Angular's New Control Flow](https://angular.dev/guide/templates/control-flow)
- [Reactive State Management in Angular](https://blog.angular.io/angular-v16-is-here-4d7a28ec680d#1d34)
