const moneda = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(n) || 0);

const escapar = (valor) =>
  String(valor ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const fecha = (valor) =>
  new Date(valor ?? Date.now()).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" });

const filasHtml = (detalles) =>
  detalles
    .map(
      (d) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapar(d.nombreProducto)}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">${d.cantidad}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${moneda(d.precioUnitario)}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">${moneda(d.subtotal)}</td>
      </tr>`
    )
    .join("");

const tabla = (pedido) => `
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <thead>
      <tr style="background:#4f46e5;color:#fff">
        <th style="padding:8px;text-align:left">Producto</th>
        <th style="padding:8px">Cant.</th>
        <th style="padding:8px;text-align:right">Precio</th>
        <th style="padding:8px;text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>${filasHtml(pedido.detalles)}</tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:8px;text-align:right"><strong>Total</strong></td>
        <td style="padding:8px;text-align:right"><strong>${moneda(pedido.total)}</strong></td>
      </tr>
    </tfoot>
  </table>`;

const marco = (titulo, contenido) => `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
    <div style="background:#4f46e5;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0">
      <h2 style="margin:0">Pablo Store</h2>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px">
      <h3 style="margin-top:0">${titulo}</h3>
      ${contenido}
    </div>
  </div>`;

const textoDetalles = (pedido) =>
  pedido.detalles
    .map((d) => `- ${d.nombreProducto} x${d.cantidad}: ${moneda(d.subtotal)}`)
    .join("\n");

function plantillaCliente({ pedido, cliente, pago }) {
  const asunto = `Pablo Store - Pedido #${pedido.id} pendiente de pago`;

  const html = marco(
    `Gracias por tu compra, ${escapar(cliente.nombre)}`,
    `<p>Tu pedido <strong>#${pedido.id}</strong> fue registrado el ${fecha(pedido.fechaCreacion)} con estado
     <strong>Pendiente de Pago</strong>.</p>
     ${tabla(pedido)}
     <h4>Instrucciones de pago</h4>
     <p>Realiza una transferencia bancaria con los siguientes datos:</p>
     <ul>
       <li><strong>Banco:</strong> ${escapar(pago.banco)}</li>
       <li><strong>Titular:</strong> ${escapar(pago.titular)}</li>
       <li><strong>CLABE:</strong> ${escapar(pago.clabe)}</li>
       <li><strong>Monto:</strong> ${moneda(pedido.total)}</li>
       <li><strong>Referencia:</strong> PEDIDO-${pedido.id}</li>
     </ul>
     <p>Tienes <strong>${pago.plazoHoras} horas</strong> para completar el pago. Una vez confirmado, procesaremos tu pedido.</p>`
  );

  const texto = [
    `Gracias por tu compra, ${cliente.nombre}.`,
    `Pedido #${pedido.id} - Estado: Pendiente de Pago`,
    "",
    textoDetalles(pedido),
    `Total: ${moneda(pedido.total)}`,
    "",
    "Instrucciones de pago (transferencia bancaria):",
    `Banco: ${pago.banco}`,
    `Titular: ${pago.titular}`,
    `CLABE: ${pago.clabe}`,
    `Referencia: PEDIDO-${pedido.id}`,
    `Plazo: ${pago.plazoHoras} horas`,
  ].join("\n");

  return { asunto, html, texto };
}

function plantillaAdmin({ pedido, cliente }) {
  const asunto = `Nuevo pedido #${pedido.id} - ${moneda(pedido.total)}`;

  const html = marco(
    "Nuevo pedido recibido",
    `<p><strong>Cliente:</strong> ${escapar(cliente.nombre)} (${escapar(cliente.email)})</p>
     <p><strong>Fecha:</strong> ${fecha(pedido.fechaCreacion)}</p>
     <p><strong>Estado:</strong> Pendiente de Pago</p>
     ${tabla(pedido)}`
  );

  const texto = [
    `Nuevo pedido #${pedido.id}`,
    `Cliente: ${cliente.nombre} (${cliente.email})`,
    "Estado: Pendiente de Pago",
    "",
    textoDetalles(pedido),
    `Total: ${moneda(pedido.total)}`,
  ].join("\n");

  return { asunto, html, texto };
}

module.exports = { plantillaCliente, plantillaAdmin };
