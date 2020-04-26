import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFamiliaAvataresComponent } from './crear-familia-avatares.component';

describe('CrearFamiliaAvataresComponent', () => {
  let component: CrearFamiliaAvataresComponent;
  let fixture: ComponentFixture<CrearFamiliaAvataresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearFamiliaAvataresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFamiliaAvataresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
