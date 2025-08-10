import React, { useState } from "react";
import { useDeleteProductMutation } from "../../store/api/apiSlice";
import { useGetProductsQuery } from "../../store/api/apiSlice";
import styles from "./ProductList.module.css";
import FilterBar from "./FilterBar/FilterBar";
import ProductTable from "./ProductTable";
import Pagination from "../ProductList/Pagination";
import Modal from "./Modal";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery({
    page,
    limit,
    ...filters,
  });

  const productList = productsData?.data?.products || productsData?.products || [];
  const products = productList.map((product) => {
    const variant = product.variants && product.variants[0] ? product.variants[0] : {};
    const primaryImage = variant.images && variant.images.length > 0
      ? variant.images.find((img) => img.isPrimary) || variant.images[0]
      : null;
    return {
      id: product._id,
      name: product.name,
      img: primaryImage ? primaryImage.url : "",
      category: product.category?.tertiary || product.category?.primary || "",
      price:
        variant.pricing?.salePrice ||
        variant.pricing?.basePrice ||
        product.pricing?.salePrice ||
        product.pricing?.basePrice ||
        0,
      stock: variant.inventory?.quantity ?? "",
      status:
        variant.inventory?.quantity > (variant.inventory?.lowStockThreshold ?? 5)
          ? "In Stock"
          : variant.inventory?.quantity > 0
          ? "Low Stock"
          : "Out of Stock",
    
      variantId: variant.variantId || variant._id,
      originalProduct: product, 
    };
  });
  const totalItems =
    productsData?.data?.pagination?.total ||
    productsData?.pagination?.total ||
    productsData?.total ||
    0;

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  
  };

  const [deleteProduct] = useDeleteProductMutation();

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id).unwrap();
      } catch (err) {
        alert('Failed to delete product: ' + (err?.data?.message || err.message));
      }
    }
  };

  return (
    <>
      <button
        className={styles.fabAddBtn}
        onClick={() => setShowAddModal(true)}
        title="Add Product"
        aria-label="Add Product"
      >
        <span className={styles.fabIcon}><i className="fa-solid fa-plus"></i></span>
        <span className={styles.fabTooltip}>Add Product</span>
      </button>
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <AddProduct onSuccess={() => setShowAddModal(false)} />
      </Modal>
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        {editingProduct && (
          <EditProduct 
            product={editingProduct} 
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditModal(false)} 
          />
        )}
      </Modal>
      {isLoading ? (
        <main className={styles.productListContainer}>
          <div className={styles.productListCard}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
          </div>
        </main>
      ) : error ? (
        <main className={styles.productListContainer}>
          <div className={styles.productListCard}>
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              Error loading products: {error?.data?.message || error.message}
            </div>
          </div>
        </main>
      ) : (
        <main className={styles.productListContainer}>
          <div className={styles.productListCard}>
            <FilterBar onFilterChange={setFilters} products={products} />
            <ProductTable products={products} onEditProduct={handleEditProduct} onDeleteProduct={handleDeleteProduct} />
            <Pagination
              totalItems={totalItems}
              currentPage={page}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default ProductList;
