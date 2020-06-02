import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignaEscenarioComponent } from './asigna-escenario.component';



describe('AsignaCuestionarioComponent', () => {
  let component: AsignaEscenarioComponent;
  let fixture: ComponentFixture<AsignaEscenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignaEscenarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaEscenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
