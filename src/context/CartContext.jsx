import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("fancyStoreCart");

    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  });

  // Save cart whenever cart changes
  useEffect(() => {
    localStorage.setItem(
      "fancyStoreCart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add product
  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Remove product
  const removeFromCart = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  // Increase / decrease quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: quantity,
            }
          : item
      )
    );
  };

  // Empty entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total number of products
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}