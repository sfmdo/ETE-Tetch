import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LegalService {

  constructor() { }


  getPrivacyPolicy(): string {
    return `
      <div class="space-y-6">
        <p class="text-body-md text-on-surface leading-relaxed">
          <span class="font-bold text-primary">ETETECH Sa de CV</span>, como responsable en el tratamiento de sus datos personales, emite el presente aviso en cumplimiento con los artículos 15 y 16 de la <span class="italic">LFPDPPP</span>, informando que es responsable de la obtención, uso, almacenamiento y protección de sus datos personales.
        </p>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-3 uppercase tracking-wider">Datos Personales Recabados</h2>
          <ul class="list-disc list-inside text-body-md text-on-surface space-y-1 ml-2">
            <li>Nombre completo.</li>
            <li>Teléfono (fijo y/o móvil).</li>
            <li>Correo electrónico.</li>
            <li>Domicilio completo.</li>
            <li>RFC.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-3 uppercase tracking-wider">Finalidades del Tratamiento</h2>
          <div class="space-y-3">
            <p class="text-body-md text-on-surface"><span class="font-semibold underline">Primarias:</span> Proveer los servicios y productos solicitados; dar cumplimiento a las obligaciones contraídas con el titular; y notificar sobre cambios en los servicios contratados.</p>
            <p class="text-body-md text-on-surface"><span class="font-semibold underline">Secundarias:</span> Notificar sobre nuevos productos o servicios relacionados; realizar estudios de mercado para determinar hábitos de consumo; y evaluar periódicamente la calidad de nuestros servicios.</p>
          </div>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-3 uppercase tracking-wider">Derechos ARCO</h2>
          <p class="text-body-md text-on-surface mb-3">Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (ARCO). Procedimientos:</p>
          <div class="grid grid-cols-1 gap-3">
            <div class="p-3 bg-surface-container-low rounded-lg border-l-4 border-primary">
              <p class="text-body-sm"><span class="font-bold">Autogestión:</span> Directamente en nuestra plataforma en su perfil.</p>
            </div>
            <div class="p-3 bg-surface-container-low rounded-lg border-l-4 border-primary">
              <p class="text-body-sm"><span class="font-bold">Correo Electrónico:</span> Solicitud a <span class="text-primary font-medium">22300940@ceti.mx</span>.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-3 uppercase tracking-wider">Seguridad y Transferencia</h2>
          <p class="text-body-md text-on-surface leading-relaxed">
            Únicamente realiza transferencias de información con empresas de procesamiento como <span class="font-bold text-blue-800">PayPal</span> bajo estándares de seguridad financiera. Los datos se transmiten encriptados para asegurar su resguardo.
          </p>
        </section>
      </div>
    `;
  }

  /**
   * Retorna los Términos y Condiciones de ETETECH
   */
  getTermsAndConditions(): string {
    return `
      <div class="space-y-8">
        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-2 uppercase tracking-wider">1. Perfil del Usuario</h2>
          <p class="text-body-md text-on-surface">1.1. El cliente declara que la información proporcionada es verídica y actualizada.</p>
          <p class="text-body-md text-on-surface">1.2. El cliente declara ser mayor de edad con capacidad legal.</p>
          <p class="text-body-md text-on-surface">1.3. El cliente es responsable de la confidencialidad de sus credenciales.</p>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-2 uppercase tracking-wider">2. Uso de la Plataforma</h2>
          <p class="text-body-md text-on-surface">2.1. Uso exclusivo para fines legales.</p>
          <p class="text-body-md text-on-surface">2.2. Prohibido intentar vulnerar la seguridad del sistema.</p>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-2 uppercase tracking-wider">3. Solicitud de Servicios</h2>
          <p class="text-body-md text-on-surface">3.1. Proporcionar información correcta del equipo (marca, modelo y problema).</p>
          <p class="text-body-md text-on-surface">3.2. ETE-Tech se responsabiliza únicamente por los servicios registrados en la orden digital.</p>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-2 uppercase tracking-wider">5. Costos y Pagos</h2>
          <div class="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <p class="text-body-md text-on-surface">5.4. El cliente acepta que todos los pagos se realizan exclusivamente mediante la plataforma <span class="font-bold">PayPal</span>.</p>
          </div>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-2 uppercase tracking-wider">8. Responsabilidad de Información</h2>
          <p class="text-body-md text-on-surface font-semibold text-error">8.1. ETE-Tech no gestiona ni respalda información contenida en los equipos.</p>
          <p class="text-body-md text-on-surface">8.2. Es responsabilidad del cliente resguardar su información personal.</p>
        </section>

        <section>
          <h2 class="text-title-sm font-headline font-bold text-primary mb-2 uppercase tracking-wider">11. Limitación de Responsabilidad</h2>
          <p class="text-body-md text-on-surface">11.2. No se realizarán reembolsos una vez procesado el pago del servicio.</p>
          <p class="text-body-md text-on-surface">11.3. Puede cancelar la solicitud antes de realizar el pago sin penalización.</p>
        </section>

        <p class="text-label-sm italic text-on-surface-variant pt-4 border-t border-outline-variant/20">
          Vigentes desde la fecha de aceptación. Última modificación: Mayo 2026.
        </p>
      </div>
    `;
  }
}
export default LegalService;