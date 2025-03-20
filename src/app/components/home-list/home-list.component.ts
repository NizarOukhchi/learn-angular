import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeCardComponent } from "../home-card/home-card.component";
import { HomeService } from "../../services/home.service";
import { Home } from "../../models/home.type";

@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [CommonModule, HomeCardComponent],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent implements OnInit {
  constructor() {
    // Load favorites from localStorage when component is created
    this.loadFavoritesFromStorage();
  }
  // Inject the service using inject function
  private homeService = inject(HomeService);

  // Using signals for reactive state
  homes = signal<Home[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  showPoolsOnly = signal(false);

  // New signal for favorites
  private favoritesSignal = signal<number[]>([]);

  // Computed values
  hasHomes = computed(() => this.homes().length > 0);

  homesWithPools = computed(() => this.homes().filter(home => home.hasPool));

  toggleShowPools($event: Event) {
    this.showPoolsOnly.set((<HTMLInputElement>$event.target).checked);
    if (this.showPoolsOnly()) {
      this.homes.set(this.homesWithPools());
    } else {
      this.loadHomes();
    }
  }
  homesFavorites = computed(() => this.homes().filter(home => home.isFavorite));

  homesFiltered = computed(() => {
    if (this.showPoolsOnly()) {
      return this.homesWithPools().filter(home => home.isFavorite);
    }
    return this.homes().filter(home => home.isFavorite);
  });

  get homesFavoritesCount() : number {
    return this.homesFavorites().length;
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

  refreshHomes() {
    this.loadHomes();
  }
}