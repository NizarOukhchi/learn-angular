# Angular Homes App - Day 2 Tutorial

## Description

This is the take-home exercise for Day 2. Today, you'll build on your Day 1 progress by implementing routing, creating a component to display a list of homes, and creating your first Angular service to fetch data from the JSON server. You'll also learn about Angular's latest features: the new control flow syntax and signals for reactive state management.

### Objectives:

- Set up Angular routing
- Create a home-list component to display multiple properties
- Learn about Angular services
- Implement HTTP requests using Angular's HttpClient
- Connect components with services
- Use Angular's new control flow (@if, @for, @empty)
- Implement reactive state with Angular signals
- Create a favorites feature with localStorage persistence

### What You'll Build:

By the end of this tutorial, you'll have a home page that displays a grid of property listings fetched from the API. You'll learn how Angular's component architecture enables you to reuse the home-card component you built yesterday within a list view. You'll also implement a favorites feature that allows users to mark homes they like and persist those choices between sessions.

Let's get started!

## Step 1: Set Up Routing

First, let's configure routing to navigate between different views in our application.

### 1. Configure the Routes

Update `app.routes.ts` in the src/app directory:

```typescript
import { Routes } from "@angular/router";

export const routes: Routes = [
  // More routes will be added later
  {
    path: "",
    redirectTo: "homes",
    pathMatch: "full",
  },
];
```

### 2. Update the App Component

Make sure the `app.component.html` has a router outlet to display the routed components:

```html
<div class="container mx-auto px-4 py-8">
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-indigo-800">Angular Homes</h1>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <router-outlet></router-outlet>
  </main>
</div>
```

Update `app.component.ts` to import the RouterOutlet:

```typescript
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "angular-homes";
}
```

## Step 2: Create the Home List Component

Now let's create a component to display multiple home listings using Angular signals for state management.

### 1. Generate the Component

```bash
ng generate component home-list
```

### 2. Update the Home List Component with Signals

Update `home-list.component.ts`:

```typescript
import { Component, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeCardComponent } from "../home-card/home-card.component";
import { Home } from "../models/home.type";

@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [CommonModule, HomeCardComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent {
  // Using signals for reactive state
  homes = signal<Home[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed value based on homes signal
  hasHomes = computed(() => this.homes().length > 0);

  constructor() {}

  ngOnInit() {
    // We'll populate this from a service later
  }
}
```

Update `home-list.component.html` with the new control flow syntax:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  @for (home of homes(); track home.id) {
  <app-home-card [home]="home"></app-home-card>
  } @empty {
  <p class="text-gray-500 col-span-3 text-center py-12">No homes found. Please check back later.</p>
  }
</div>
```

### 3. Add the Home List Route

Update `app.routes.ts` to include the HomeListComponent:

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

## Step 3: Create the Home Service

Now let's create a service to fetch home data from our JSON server.

### 1. Generate the Service

```bash
ng generate service services/home
```

### 2. Implement the Home Service

Update `home.service.ts`:

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Home } from "../models/home.type";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private apiUrl = "http://localhost:3000/homes";

  constructor(private http: HttpClient) {}

  /**
   * Get all homes from the API
   * @returns Observable of Home array
   */
  getAllHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(this.apiUrl);
  }
}
```

### 3. Add HttpClientModule to App Config

Update `app.config.ts` to include the HttpClientModule:

```typescript
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};
```

## Step 4: Connect the Service to the Component

Now let's update the HomeListComponent to use the service with signals.

### 1. Update the Home List Component

Update `home-list.component.ts`:

```typescript
import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeCardComponent } from "../home-card/home-card.component";
import { HomeService } from "../services/home.service";
import { Home } from "../models/home.type";

@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [CommonModule, HomeCardComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent {
  // Inject the service using the new inject function
  private homeService = inject(HomeService);

  // Using signals for reactive state
  homes = signal<Home[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed value based on homes signal
  hasHomes = computed(() => this.homes().length > 0);

  ngOnInit() {
    this.loadHomes();
  }

  loadHomes() {
    this.isLoading.set(true);
    this.error.set(null);

    this.homeService.getAllHomes().subscribe({
      next: (homes) => {
        this.homes.set(homes);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set("Failed to load homes. Please try again later.");
        this.isLoading.set(false);
        console.error("Error fetching homes:", err);
      },
    });
  }

  refreshHomes() {
    this.loadHomes();
  }
}
```

### 2. Update the Home List Component Template

Update `home-list.component.html` to handle loading and error states with control flow and signals:

```html
<!-- Refresh button -->
<div class="mb-6">
  <button (click)="refreshHomes()" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Refresh Listings</button>
</div>

<!-- Loading state -->
@if (isLoading()) {
<div class="flex justify-center items-center min-h-[200px]">
  <p class="text-gray-500">Loading homes...</p>
</div>
}

<!-- Error state -->
@else if (error()) {
<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  <p>{{ error() }}</p>
</div>
}

<!-- Homes grid -->
@else {
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  @for (home of homes(); track home.id) {
  <app-home-card [home]="home"></app-home-card>
  } @empty {
  <p class="text-gray-500 col-span-3 text-center py-12">No homes found. Please check back later.</p>
  }
</div>
}
```

## Step 5: Test Your Application

### 1. Make sure the JSON server is running:

```bash
npm run server
```

### 2. Start the Angular application:

```bash
npm run start
```

Navigate to http://localhost:4300 and you should see a list of homes fetched from the JSON server.

## Step 6: Implement Favorites Functionality

In this step, we'll enhance our application by adding the ability to mark homes as favorites. We'll use signals to manage the favorite state and localStorage to persist the user's selections between sessions.

### 1. Update the Home Model

First, let's modify our `home.type.ts` model to include a property for favorite status:

```typescript
/**
 * Interface representing a home listing
 * This defines the structure of a home object in our application
 */
export interface Home {
  id?: number; // Optional as it will be auto-generated for new homes
  title: string; // Title of the home listing
  description: string; // Detailed description of the property
  city: string; // City where the property is located
  rooms: number; // Number of rooms in the property
  bathrooms: number; // Number of bathrooms in the property
  hasPool: boolean; // Whether the property has a pool
  picture: string; // URL to the picture of the property
  isFavorite?: boolean; // Whether the home is marked as a favorite
}
```

### 2. Update the Home Card Component

Now let's enhance our HomeCardComponent to include a favorite button and emit events when it's clicked:

#### Update home-card.component.ts:

```typescript
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { LucideAngularModule, WavesLadder, Bed, Bath, MapPin, Heart } from "lucide-angular";

import { Home } from "../models/home.type";

/**
 * Component for displaying a single home card
 * This is a presentational component that receives a Home object via @Input
 */
@Component({
  selector: "app-home-card",
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: "./home-card.component.html",
  styleUrls: ["./home-card.component.css"],
})
export class HomeCardComponent {
  @Input() home!: Home;
  @Output() toggleFavorite = new EventEmitter<number>();

  readonly WavesLadder = WavesLadder;
  readonly Bed = Bed;
  readonly Bath = Bath;
  readonly MapPin = MapPin;
  readonly Heart = Heart;

  /**
   * Emit the home id when favorite is toggled
   */
  onFavoriteClick(): void {
    if (this.home.id) {
      this.toggleFavorite.emit(this.home.id);
    }
  }
}
```

#### Update home-card.component.html:

Add a favorite button to the home card:

```html
<!-- Home card -->
<div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
  <!-- Home image -->
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
      <lucide-icon [img]="Heart" [color]="home.isFavorite ? 'white' : 'gray'" class="w-5 h-5"></lucide-icon>
    </button>
  </div>

  <!-- Rest of the home card stays the same -->
  <!-- ... -->
</div>
```

### 3. Implement Favorite State Management in the Home List Component

Let's update the HomeListComponent to track and manage favorite status:

```typescript
import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeCardComponent } from "../home-card/home-card.component";
import { HomeService } from "../services/home.service";
import { Home } from "../models/home.type";

@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [CommonModule, HomeCardComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent implements OnInit {
  // Inject the service using inject function
  private homeService = inject(HomeService);

  // Using signals for reactive state
  homes = signal<Home[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // New signal for favorites
  private favoritesSignal = signal<number[]>([]);

  // Computed values
  hasHomes = computed(() => this.homes().length > 0);

  constructor() {
    // Load favorites from localStorage when component is created
    this.loadFavoritesFromStorage();
  }

  ngOnInit() {
    this.loadHomes();
  }

  loadHomes() {
    this.isLoading.set(true);
    this.error.set(null);

    this.homeService.getAllHomes().subscribe({
      next: (homes) => {
        // Add favorite status to homes
        const homesWithFavorites = this.addFavoriteStatus(homes);
        this.homes.set(homesWithFavorites);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set("Failed to load homes. Please try again later.");
        this.isLoading.set(false);
        console.error("Error fetching homes:", err);
      },
    });
  }

  /**
   * Handle favorite toggle event from home card
   */
  onToggleFavorite(homeId: number) {
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
    const updatedHomes = this.addFavoriteStatus(this.homes());
    this.homes.set(updatedHomes);

    // Save to localStorage
    this.saveFavoritesToStorage();
  }

  /**
   * Add favorite status to homes based on favorites signal
   */
  private addFavoriteStatus(homes: Home[]): Home[] {
    const favorites = this.favoritesSignal();

    return homes.map((home) => ({
      ...home,
      isFavorite: home.id ? favorites.includes(home.id) : false,
    }));
  }

  /**
   * Load favorites from localStorage
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

### 4. Update the Home List Component Template

Update the template to handle favorite toggling:

```html
<!-- Previous template structure remains the same -->

<!-- Homes grid -->
@else {
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  @for (home of homes(); track home.id) {
  <app-home-card [home]="home" (toggleFavorite)="onToggleFavorite($event)"></app-home-card>
  } @empty {
  <p class="text-gray-500 col-span-3 text-center py-12">No homes found. Please check back later.</p>
  }
</div>
}
```

### 5. Understanding How It Works

1. **State Management**: We use a signal `favoritesSignal` to store an array of home IDs that the user has marked as favorites.

2. **Persistence**: We read from and write to localStorage to persist the user's favorite selections between sessions.

3. **Component Communication**:

   - Child Component (HomeCardComponent): Displays the favorite button and emits an event when clicked
   - Parent Component (HomeListComponent): Manages the state and updates localStorage

4. **UI Feedback**: The heart icon changes color based on whether the home is favorited or not.

This approach demonstrates Angular's component architecture and unidirectional data flow:

- Parent components pass data down to children via inputs (`@Input()`)
- Child components notify parents of events via outputs (`@Output()` with `EventEmitter`)

## Understanding Angular Signals

Signals are a new way to manage reactive state in Angular applications.

### Key Concepts:

1. **Signals**:

   - Created using the `signal()` function
   - Hold values that can change over time
   - Automatically track dependencies
   - Example: `homes = signal<Home[]>([])`

2. **Updating Signal Values**:

   - Use `.set()` to replace the current value: `homes.set(newHomes)`
   - Use `.update()` to derive a new value from the current one: `count.update(c => c + 1)`
   - Use `.mutate()` for objects/arrays: `users.mutate(users => users.push(newUser))`

3. **Reading Signal Values**:

   - Call the signal as a function: `homes()`
   - Always returns the current value

4. **Computed Signals**:

   - Created with `computed()` function
   - Derive values from other signals
   - Update automatically when dependencies change
   - Example: `hasHomes = computed(() => homes().length > 0)`

5. **Effects**:
   - Run side effects when signals change
   - Created with `effect()` function

### Benefits of Signals:

- Fine-grained reactivity
- Improved performance
- Better debugging
- More predictable state changes
- Less boilerplate than RxJS for simple state management

## Bonus Challenge

Now that you have the basic functionality working, try implementing these additional features:

1. Add a loading spinner instead of the "Loading homes..." text
2. Create a computed signal that filters homes with pools
3. Add a toggle button to show only homes with pools using your computed signal
4. Add a "Favorites" filter that shows only favorite homes
5. Create a favorites count indicator in the header

## Additional Resources

- [Angular Router Documentation](https://angular.dev/guide/routing)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Services](https://angular.dev/guide/services)
- [HttpClient](https://angular.dev/guide/http)
- [Angular Control Flow](https://angular.dev/guide/templates/control-flow)
