import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchmakingwcsComponent } from './matchmakingwcs.component';

describe('MatchmakingwcsComponent', () => {
  let component: MatchmakingwcsComponent;
  let fixture: ComponentFixture<MatchmakingwcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchmakingwcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchmakingwcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
