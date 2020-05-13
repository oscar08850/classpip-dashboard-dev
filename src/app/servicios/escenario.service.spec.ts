import { TestBed } from '@angular/core/testing';

import { EscenarioService } from './escenario.service';

describe('EscenarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EscenarioService = TestBed.get(EscenarioService);
    expect(service).toBeTruthy();
  });
});
