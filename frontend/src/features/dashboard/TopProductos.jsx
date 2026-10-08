import { formatoMoneda } from "../../services/api";

export default function TopProductos({ productos }) {
  if (productos.length === 0) return <p className="dash-vacio">Sin ventas en el período seleccionado</p>;
  const maximo = Math.max(...productos.map((p) => p.unidades));

  return (
    <div className="tabla-contenedor">
      <table className="dash-tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Rotación</th>
            <th className="num">Unidades</th>
            <th className="num">Monto</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.productoId}>
              <td>{p.posicion}</td>
              <td>{p.nombre}</td>
              <td>
                <div className="dash-barra">
                  <div style={{ width: `${(p.unidades / maximo) * 100}%` }} />
                </div>
              </td>
              <td className="num">{p.unidades}</td>
              <td className="num">{formatoMoneda(p.monto)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
