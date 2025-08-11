import React from 'react';
import { useGetFeaturedProductsQuery } from '../../store/api/apiSlice';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts = () => {
  const { data: featuredData, isLoading, error } = useGetFeaturedProductsQuery({ limit: 20 });
  const featuredProducts = featuredData?.products || [];

  if (isLoading) {
    return (
      <div className={styles.featuredContainer}>
        <h2 className={styles.title}>Featured Products</h2>
        <div className={styles.loading}>Loading featured products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.featuredContainer}>
        <h2 className={styles.title}>Featured Products</h2>
        <div className={styles.error}>Error loading featured products: {error?.data?.message || error.message}</div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className={styles.featuredContainer}>
        <h2 className={styles.title}>Featured Products</h2>
        <div className={styles.empty}>
          <i className="fas fa-star"></i>
          <p>No featured products yet. Mark products as featured when adding them!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.featuredContainer}>
      <h2 className={styles.title}>
        <i className="fas fa-star"></i>
        Featured Products ({featuredProducts.length})
      </h2>
      <div className={styles.productGrid}>
        {featuredProducts.map((product) => {
          const variant = product.variants?.[0] || {};
          const primaryImage = variant.images?.find(img => img.isPrimary) || variant.images?.[0];
          const price = variant.pricing?.salePrice || variant.pricing?.basePrice || product.pricing?.basePrice || 0;
          
          return (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                {primaryImage ? (
                  <img src={primaryImage.url} alt={product.name} className={styles.productImage} />
                ) : (
                  <div className={styles.noImage}>
                    <i className="fas fa-image"></i>
                  </div>
                )}
                <div className={styles.featuredBadge}>
                  <i className="fas fa-star"></i>
                  Featured
                </div>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productSku}>SKU: {product.sku}</p>
                <p className={styles.productBrand}>{product.brand}</p>
                <p className={styles.productCategory}>
                  {product.category?.primary}
                  {product.category?.secondary && ` / ${product.category.secondary}`}
                </p>
                <div className={styles.productPrice}>${price.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
