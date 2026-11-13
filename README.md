# Directorio · sandbox Node

Prueba aislada del Directorio actual. Node genera una página estática por negocio; la interfaz sigue siendo la misma SPA. No usa Actions ni cambia `directorio.oficial.pe`.

## Requisitos

- Node.js 20 o posterior.
- No requiere instalar paquetes.

## Probar localmente

```powershell
npm run build
npm run preview
```

Abre `http://127.0.0.1:4173/directorio-labs/`. Para probar una ficha, ábrela desde el listado y copia su URL; también puedes recargar o abrir esa URL en otra pestaña. Las fichas generadas quedan en `negocios/`.

## Publicar manualmente en GitHub Pages

1. Ejecuta `npm run build` antes de subir cambios.
2. Sube el código y las fichas generadas de `negocios/` a la rama `main`.
3. En **Settings → Pages**, elige **Deploy from a branch**, `main` y `/ (root)`.

Node corre en tu equipo para generar HTML. GitHub Pages sirve archivos estáticos; no se ejecuta Node en el sitio ni hace falta GitHub Actions. Cada cambio que afecte la web requiere volver a ejecutar el generador antes de subir.

## Alcance de la prueba

- Genera rutas `/negocios/nombre-del-negocio-ID/` desde `data/negocios.csv`.
- Las rutas directas abren la ficha en la SPA y tienen título, descripción y canonical propios.
- Conserva la URL de consulta para vistas y filtros; los detalles de promociones siguen con el comportamiento actual.
- La vista local usa el mismo prefijo que GitHub Pages.

Los CSV son datos de demo y se mantienen como están. Esta sandbox no reemplaza ni altera el repo de producción.

GitHub Pages usa su propio flujo interno de despliegue. Este repositorio no configura un workflow para compilar con Node.
