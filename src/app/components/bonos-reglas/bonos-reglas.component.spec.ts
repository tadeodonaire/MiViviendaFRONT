import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosReglasComponent } from './bonos-reglas.component';

describe('BonosReglasComponent', () => {
  let component: BonosReglasComponent;
  let fixture: ComponentFixture<BonosReglasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonosReglasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonosReglasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
