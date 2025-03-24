import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HomeService } from "../services/home.service";
import { Home } from "../models/home";
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