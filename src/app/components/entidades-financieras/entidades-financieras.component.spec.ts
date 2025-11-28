import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadesFinancierasComponent } from './entidades-financieras.component';

describe('EntidadesFinancierasComponent', () => {
  let component: EntidadesFinancierasComponent;
  let fixture: ComponentFixture<EntidadesFinancierasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntidadesFinancierasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadesFinancierasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
