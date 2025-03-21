import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomecardComponent } from './homecard.component';

describe('HomecardComponent', () => {
  let component: HomecardComponent;
  let fixture: ComponentFixture<HomecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomecardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
