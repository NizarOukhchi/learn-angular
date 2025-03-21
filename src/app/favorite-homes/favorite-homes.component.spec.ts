import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteHomesComponent } from './favorite-homes.component';

describe('FavoriteHomesComponent', () => {
  let component: FavoriteHomesComponent;
  let fixture: ComponentFixture<FavoriteHomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteHomesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
