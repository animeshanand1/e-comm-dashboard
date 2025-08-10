import React from "react";
import { useGetInventoryQuery } from "../../store/api/apiSlice";
import styles from "./Inventory.module.css";

const Inventory = () => {
  const { data: inventoryData, isLoading, error } = useGetInventoryQuery();

  if (isLoading) {
    return (
      <div className={styles.inventoryContainer}>
        <h2 className={styles.inventoryTitle}>Inventory Management</h2>
        <p>Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.inventoryContainer}>
        <h2 className={styles.inventoryTitle}>Inventory Management</h2>
        <p style={{ color: 'red' }}>
          Error loading inventory: {error?.data?.message || error.message}
        </p>
      </div>
    );
  }

  const { products = [], lowStockProducts = [] } = inventoryData || {};

  return (
    <div className={styles.inventoryContainer}>
      <h2 className={styles.inventoryTitle}>Inventory Management</h2>

      <div className={styles.allInventorySection}>
        <h3>All Products Inventory ({products.length} products)</h3>
        {products.map((product) => {
         
          let totalStock = 0;
          let minBasePrice = null;
          let minSalePrice = null;
          if (Array.isArray(product.variants)) {
            product.variants.forEach(variant => {
              if (variant.inventory && variant.inventory.trackInventory) {
                totalStock += Number(variant.inventory.quantity) || 0;
              }
              if (variant.pricing) {
                if (minBasePrice === null || variant.pricing.basePrice < minBasePrice) {
                  minBasePrice = variant.pricing.basePrice;
                }
                if (variant.pricing.salePrice && (minSalePrice === null || variant.pricing.salePrice < minSalePrice)) {
                  minSalePrice = variant.pricing.salePrice;
                }
              }
            });
          }
          return (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.productName}>{product.name}</div>
              <div className={styles.productBrand}><strong>Brand:</strong> {product.brand}</div>
              <div className={styles.productCategory}><strong>Category:</strong> {product.category?.name || 'N/A'}</div>
              <div className={styles.productStock}><strong>Stock:</strong> {totalStock}</div>
              <div className={styles.productPrice}><strong>Price:</strong> ${minBasePrice !== null ? minBasePrice : 'N/A'}
                {minSalePrice !== null && (
                  <span className={styles.variantSale} style={{ color: '#e74c3c', marginLeft: 8 }}>
                    Sale: ${minSalePrice}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
