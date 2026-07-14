# Cómo montar la landing Bita en Duda (dominio oficial)

Objetivo: que la página viva en tu dominio de Duda, ej. `castdim.mx/sotavento-residencial/bita`,
lista para mandarse a clientes por WhatsApp.

Las fotos y el video **no se suben a Duda**: se cargan solos desde GitHub Pages
(`https://isdhjai.github.io/Inmobiliaria-MC-Bita/`), que funciona como CDN gratuito.
Si algún día cambias las fotos en GitHub, la página de Duda se actualiza sola.

## Pasos (una sola vez, ~10 minutos)

1. **Crear la página**
   En tu sitio de Duda: Páginas → **+ Nueva página** → elige "Página en blanco".
   - Nombre: `Bita`
   - En ajustes de la página (SEO / URL): pon la ruta que te pidan, ej. `/sotavento-residencial/bita`.

2. **Pegar el CSS (head)**
   En la página: ⚙ Ajustes de página → **Código personalizado** → sección **Encabezado (head)**.
   Pega TODO el contenido del archivo [`head.html`](head.html).

3. **Pegar el contenido (body)**
   En el editor visual, arrastra un **widget HTML** a la página (que ocupe todo el ancho,
   una sola columna, sin márgenes).
   Pega TODO el contenido del archivo [`body.html`](body.html).

4. **Ocultar el menú de Duda en esta página** (para que se vea a pantalla completa)
   Si el sitio muestra su propio encabezado/pie en esta página, en `head.html` hay una
   línea comentada al final que los oculta — quítale el `/*` y `*/` y vuelve a pegar.

5. **SEO y vista previa de WhatsApp**
   En ajustes de la página → SEO:
   - Título: `Bita — MC Inmobiliaria | Privada Sotavento, Villa de Pozos`
   - Descripción: `Casa en venta: 3 habitaciones, 195.36 m² de construcción. Agenda tu visita.`
   - Imagen para compartir: sube `images/galeria/38.jpg` (la fachada con precio).
   Así, al mandar el enlace por WhatsApp, el cliente ve la foto y el título correctos.

6. **Publicar** y probar el enlace en un celular.

## Datos rápidos

- WhatsApp configurado: 52 444 411 9732 con mensaje precargado.
- Para cambiar número o mensaje: en `body.html` busca `WA_NUMBER` y `WA_MESSAGE` (están al inicio del `<script>`).
- Para cambiar el precio: busca `$3,324,000` en `body.html` (aparece 1 vez).
