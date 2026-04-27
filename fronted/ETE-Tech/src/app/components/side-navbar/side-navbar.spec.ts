import { ComponentFixture, TestBed } from '@angular/core/testing';
// 1. Importamos el módulo de pruebas de rutas
import { RouterTestingModule } from '@angular/router/testing'; 

// Asegúrate de que la ruta y el nombre coincidan con tu archivo real (.component al final es lo estándar)
import { SideNavbar } from './side-navbar'; 

describe('SideNavbar', () => {
  let component: SideNavbar;
  let fixture: ComponentFixture<SideNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Agregamos RouterTestingModule para que no marque error el routerLink del HTML
      imports: [SideNavbar, RouterTestingModule] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavbar);
    component = fixture.componentInstance;
    
    // 3. Forzamos la detección de cambios inicial para que el HTML se dibuje en la prueba
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});