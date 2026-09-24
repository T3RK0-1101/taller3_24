import { createContext, useContext, useEffect, useState } from "react";

const CART_KEY = "taller3_carrito";
const CartContext = createContext(null);

const leerCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const agregar = (producto) =>
    setItems((actuales) => {
      const existente = actuales.find((i) => i.producto.id === producto.id);
      if (!existente) return [...actuales, { producto, cantidad: 1 }];
      return actuales.map((i) =>
        i.producto.id === producto.id ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) } : i
      );
    });

  const cambiarCantidad = (productoId, cantidad) =>
    setItems((actuales) =>
      actuales.map((i) =>
        i.producto.id === productoId
          ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.producto.stock)) }
          : i
      )
    );

  const quitar = (productoId) => setItems((actuales) => actuales.filter((i) => i.producto.id !== productoId));
  const vaciar = () => setItems([]);

  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);
  const total = items.reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, agregar, cambiarCantidad, quitar, vaciar, cantidadTotal, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
