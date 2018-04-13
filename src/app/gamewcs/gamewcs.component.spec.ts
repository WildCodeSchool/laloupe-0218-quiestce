import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamewcsComponent } from './gamewcs.component';

describe('GamewcsComponent', () => {
  let component: GamewcsComponent;
  let fixture: ComponentFixture<GamewcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GamewcsComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamewcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
