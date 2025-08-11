import React from "react";
import styles from "./ProductTable.module.css";

const ProductTable = ({ products, onEditProduct, onDeleteProduct }) => {
   
    const getStatusClass = (status) => {
        if (status === 'In Stock') return styles.statusInStock;
        if (status === 'Low Stock') return styles.statusLowStock;
        return styles.statusOutOfStock;
    };

    return (
        <div className={styles.productTableWrapper}>
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>Product <i className="fa-solid fa-sort"></i></th>
                        <th>Category <i className="fa-solid fa-sort"></i></th>
                        <th>Price <i className="fa-solid fa-sort"></i></th>
                        <th>Stock <i className="fa-solid fa-sort"></i></th>
                        <th>Status <i className="fa-solid fa-sort"></i></th>
                        <th className={styles.actionsCell}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td><input type="checkbox" /></td>
                            <td>
                                <div className={styles.productInfo}>
                                    <img src={product.img} alt={product.name} className={styles.productImg} />
                                    <span className={styles.productName}>{product.name}</span>
                                </div>
                            </td>
                            <td>{product.category}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.stock}</td>
                            <td>
                                <span className={`${styles.statusBadge} ${getStatusClass(product.status)}`}>
                                    {product.status}
                                </span>
                            </td>
                            <td className={styles.actionsCell}>
                                <i 
                                    className={`fa-solid fa-pencil ${styles.actionIcon}`} 
                                    title="Edit" 
                                    onClick={() => onEditProduct(product)}
                                ></i>
                                <i 
                                    className={`fa-solid fa-trash-can ${styles.actionIcon}`} 
                                    title="Delete"
                                    onClick={() => onDeleteProduct(product)}
                                ></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ProductTable;