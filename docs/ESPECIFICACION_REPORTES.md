# Especificación de endpoints — Reportes analíticos (Act. 2.6)

Todos los endpoints son de lectura (`GET`), devuelven `application/json` y requieren el encabezado `Authorization: Bearer <token>` de un usuario con rol **admin** y cuenta activa.

**Criterio de venta:** para ingresos, ranking y ticket promedio se consideran los pedidos en estado `pagado` o `enviado`. La distribución por estado incluye todos los pedidos del rango.

## Parámetros de consulta (query string)

| Parámetro | Tipo / valores | Valor por defecto | Descripción |
|---|---|---|---|
| `desde` | string (AAAA-MM-DD) | 30 días antes de «hasta» | Fecha inicial del rango (inclusive). |
| `hasta` | string (AAAA-MM-DD) | Fecha actual en la zona horaria configurada | Fecha final del rango (inclusive). |
| `agrupacion` | dia | semana | mes | Automática: ≤ 31 días → dia; ≤ 120 → semana; > 120 → mes | Granularidad de la serie de ingresos. |
| `limite` | entero 1–10 | 5 | Cantidad de productos del ranking. |

Los parámetros se validan en todos los endpoints; cada endpoint utiliza únicamente los que se indican en su sección.

## Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Consulta exitosa. |
| 400 | Parámetros inválidos: formato de fecha, «desde» posterior a «hasta», rango mayor a 366 días, agrupación no permitida o límite fuera de 1–10. |
| 401 | Falta el token JWT o es inválido. |
| 403 | El usuario autenticado no tiene rol de administrador (o su cuenta está inactiva). |

## GET /api/reportes/resumen

Devuelve en una sola respuesta todas las métricas del dashboard (productos, ingresos, estados y ticket promedio). Es el endpoint que consume el frontend.

**Parámetros:** desde, hasta, agrupacion, limite

Ejemplo de respuesta (extracto con datos de los últimos 30 días):

```json
{
  "rango": {
    "desde": "2026-09-09",
    "hasta": "2026-10-08"
  },
  "agrupacion": "dia",
  "limite": 5,
  "productos": [ … igual que /productos-mas-vendidos … ],
  "ingresos": {
    "total": 64289.5,
    "pedidos": 14,
    "serie": [ … igual que /ingresos … ]
  },
  "estados": {
    "total": 31,
    "estados": [ … igual que /estados-pedidos … ]
  },
  "ticket": {
    "pedidos": 14,
    "clientes": 7,
    "ingresos": 64289.5,
    "ticketPorPedido": 4592.11,
    "ticketPorUsuario": 9184.21
  }
}
```

## GET /api/reportes/productos-mas-vendidos

Ranking de productos por unidades vendidas (desempate por monto), con unidades y monto acumulado.

**Parámetros:** desde, hasta, limite

Ejemplo de respuesta (extracto con datos de los últimos 30 días):

```json
{
  "rango": {
    "desde": "2026-09-09",
    "hasta": "2026-10-08"
  },
  "limite": 5,
  "productos": [
    {
      "posicion": 1,
      "productoId": …,
      "nombre": "Monitor 24\"",
      "unidades": 12,
      "monto": 34788
    },
    {
      "posicion": 2,
      "productoId": …,
      "nombre": "Teclado mecánico",
      "unidades": 12,
      "monto": 15588
    },
    {
      "posicion": 3,
      "productoId": …,
      "nombre": "Webcam HD",
      "unidades": 9,
      "monto": 4945.5
    },
    {
      "posicion": 4,
      "productoId": …,
      "nombre": "Mouse inalámbrico",
      "unidades": 9,
      "monto": 3145.5
    },
    {
      "posicion": 5,
      "productoId": …,
      "nombre": "Memoria USB 64 GB",
      "unidades": 7,
      "monto": 1323
    }
  ]
}
```

## GET /api/reportes/ingresos

Serie de ingresos por periodo (día, semana o mes), sin huecos: los periodos sin ventas aparecen con valor cero.

**Parámetros:** desde, hasta, agrupacion

Ejemplo de respuesta (extracto con datos de los últimos 30 días):

```json
{
  "rango": {
    "desde": "2026-09-09",
    "hasta": "2026-10-08"
  },
  "agrupacion": "dia",
  "total": 64289.5,
  "pedidos": 14,
  "serie": [
    {
      "periodo": "2026-09-09",
      "ingresos": …,
      "pedidos": …
    },
    {
      "periodo": "2026-09-10",
      "ingresos": …,
      "pedidos": …
    },
    … // una entrada por cada día del rango
  ]
}
```

## GET /api/reportes/estados-pedidos

Distribución de los pedidos por estado (pendiente, pagado, enviado, cancelado) con cantidad, porcentaje y monto. Siempre incluye los cuatro estados.

**Parámetros:** desde, hasta

Ejemplo de respuesta (extracto con datos de los últimos 30 días):

```json
{
  "rango": {
    "desde": "2026-09-09",
    "hasta": "2026-10-08"
  },
  "total": 31,
  "estados": [
    {
      "estado": "pendiente",
      "pedidos": 8,
      "porcentaje": 25.8,
      "monto": …
    },
    {
      "estado": "pagado",
      "pedidos": 5,
      "porcentaje": 16.1,
      "monto": …
    },
    {
      "estado": "enviado",
      "pedidos": 9,
      "porcentaje": 29,
      "monto": …
    },
    {
      "estado": "cancelado",
      "pedidos": 9,
      "porcentaje": 29,
      "monto": …
    }
  ]
}
```

## GET /api/reportes/ticket-promedio

Ticket promedio por pedido y por usuario, calculado sobre los pedidos vendidos (pagados y enviados).

**Parámetros:** desde, hasta

Ejemplo de respuesta (extracto con datos de los últimos 30 días):

```json
{
  "rango": {
    "desde": "2026-09-09",
    "hasta": "2026-10-08"
  },
  "pedidos": 14,
  "clientes": 7,
  "ingresos": 64289.5,
  "ticketPorPedido": 4592.11,
  "ticketPorUsuario": 9184.21
}
```

## Errores

Los errores de validación y de autorización devuelven un objeto JSON con el campo `message` (y `detalles` cuando aplica). Ejemplo:

```json
{ "message": "La fecha inicial no puede ser posterior a la final" }
```

## Pruebas realizadas

| N.º | Prueba | Código | Resultado |
|---|---|---|---|
| 1 | GET /api/reportes/resumen sin token | 401 | Acceso rechazado por falta de autenticación. |
| 2 | GET /api/reportes/resumen con token de administrador | 200 | Respuesta con las claves rango, agrupacion, limite, productos, ingresos, estados y ticket. |
| 3 | Rango invertido (desde posterior a hasta) | 400 | «La fecha inicial no puede ser posterior a la final». |
| 4 | Agrupación no admitida | 400 | «La agrupación debe ser una de: dia, semana, mes». |
| 5 | GET /api/reportes/resumen con token de cliente | 403 | Acceso denegado: el recurso es exclusivo del rol administrador. |
