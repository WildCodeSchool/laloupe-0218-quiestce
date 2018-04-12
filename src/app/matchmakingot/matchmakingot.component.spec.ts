import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchmakingotComponent } from './matchmakingot.component';

describe('MatchmakingotComponent', () => {
  let component: MatchmakingotComponent;
  let fixture: ComponentFixture<MatchmakingotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatchmakingotComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchmakingotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
