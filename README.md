# TP Seminario – MVP (Etapa 1)

Proyecto React + Vite con un MVP de seguimiento de metas y deudores. La UI es mínima; la interacción principal se observa en la consola del navegador.

## Tecnologías

- React + Vite
- Datos en JSON local (`src/data/debtors.json`)
- Versionado: Git & GitHub (sugerido)

## Modelo de datos (JSON)

Archivo: `src/data/debtors.json`

Cada deudor tiene el siguiente schema:

```
{
	id: number,
	name: string,
	amount: number,      // monto de deuda
	phone: string,       // contacto
	reason: string       // motivo de la deuda
}
```

Ejemplo incluido en el repo con 3 deudores de prueba.

## Funcionalidad (Etapa 1)

- Cargar y mostrar por consola la lista de deudores (al montar el `Dashboard` y bajo demanda con un botón).
- Simular llamadas y acuerdos para métricas del día y totales.
- Calcular y loguear en tiempo real el avance hacia metas:
  - Llamadas diarias (`dailyCalls`)
  - Acuerdos (`agreements`)

La función de progreso limita el valor a 100%: `progress = min(100, (actual/meta) * 100)`.

## Estructura relevante

- `src/components/Dashboard.jsx`: Componente principal del MVP (métricas, simulación y logs en consola).
- `src/data/debtors.json`: Datos ficticios de deudores.
- `src/App.jsx`, `src/main.jsx`: Bootstrap de la app.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre la URL que muestre Vite (por defecto http://localhost:5173). Abre la consola del navegador para ver los logs.

## Pruebas manuales sugeridas

1. Al cargar la página, verifica en la consola que se liste la tabla de deudores con: nombre, monto, teléfono y motivo.
2. Presiona “Simular llamada” múltiples veces y observa en consola:
   - Progreso de llamadas y acuerdos (porcentaje y contadores).
   - Cambios en métricas totales y derivadas (contestadas y duración promedio) visibles en la UI mínima.
3. Presiona “Mostrar deudores (consola)” para volver a imprimir la lista.

## Próximos pasos (Etapas 2 y 3)

- Etapa 2 (Login básico): usuario/contraseña en archivo plano y validación de acceso.
- Etapa 3 (UI/UX): mockups, componentes visuales (barras de progreso, listas), manejo de errores y flujo simple.
