import React, { useState } from "react";
import styles from "./ProductList.module.css";
import FilterBar from "./FilterBar/FilterBar";
import ProductTable from "./ProductTable";
import mockProducts from "../../data/mockProducts"; 
import Pagination from "../ProductList/Pagination";
const ProductList = () => {
  const [products, setProducts] = useState(mockProducts);

  return (
    <main className={styles.productListContainer}>
      <div className={styles.productListCard}>
        <FilterBar />
        <ProductTable products={products} />
        <Pagination totalItems={products.length} />
      </div>
    </main>
  );
};

export default ProductList;