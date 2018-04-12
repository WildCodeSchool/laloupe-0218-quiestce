import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



var $wrap = $('#gameBoard');

$wrap
.on('click', '.card', function(e) {
  $(this).toggleClass('hidden');
  return false;
})
.on('mouseover', '.card', function(e) {
  $(this).addClass('toggle');
})
.on('mouseout', '.card', function(e) {
  $(this).removeClass('toggle');
});