import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamegotComponent } from './gamegot.component';

describe('GamegotComponent', () => {
  let component: GamegotComponent;
  let fixture: ComponentFixture<GamegotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GamegotComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamegotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
