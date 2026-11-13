# Historial

## Corrección del cierre de fichas

- Al volver al listado, la aplicación lee primero la URL del historial y evita reescribirla con la ficha que aún estaba abierta.
- Las fichas se generan directamente en `negocios/`. La web se prepara para publicar desde la raíz, con una sola copia de sus archivos compartidos.

## 2026-11-12 · Sandbox inicial

- Copia aislada del estado publicado de Directorio; se quitó el `CNAME` para no vincular el dominio de producción.
- Añadidos scripts Node nativos para generar una ficha HTML estática por negocio y servir `docs/` localmente.
- Las fichas usan rutas limpias, metadata propia y cargan el Directorio existente.
- Sin dependencias npm, GitHub Actions, cambios a CSV ni modificaciones al repo de producción.
