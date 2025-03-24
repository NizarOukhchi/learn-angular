import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteHomeComponent } from './favourite-home.component';

describe('FavouriteHomeComponent', () => {
  let component: FavouriteHomeComponent;
  let fixture: ComponentFixture<FavouriteHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
