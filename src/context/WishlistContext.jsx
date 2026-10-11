import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("fancyStoreWishlist");

    if (savedWishlist) {
      return JSON.parse(savedWishlist);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "fancyStoreWishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return currentItems;
      }

      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const toggleWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return currentItems.filter(
          (item) => item.id !== product.id
        );
      }

      return [...currentItems, product];
    });
  };

  const isWishlisted = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}