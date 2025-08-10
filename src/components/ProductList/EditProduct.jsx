import React, { useState } from "react";
import { useUpdateInventoryMutation } from "../../store/api/apiSlice";
import styles from "./AddProduct.module.css"; 

const EditProduct = ({ product, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    quantity: product.stock || 0,
    price: product.price || 0,
    salePrice: ""
  });
  
  const [updateInventory, { isLoading, error }] = useUpdateInventoryMutation();
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    
    try {
      
      const productId = product.id;
      const variantId = product.variantId; 
      
      console.log('Updating inventory for product:', productId, 'variant:', variantId);
      
      await updateInventory({
        productId,
        variantId,
        quantity: parseInt(form.quantity, 10),
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined
      }).unwrap();
      
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Update inventory error:', err);
      setSuccess(false);
    }
  };

  return (
    <form className={styles.addProductForm} onSubmit={handleSubmit}>
      <h3>Edit Product: {product.name}</h3>
      
      <div className={styles.formRow}>
        <label>
          Stock Quantity:
          <input 
            name="quantity" 
            value={form.quantity} 
            onChange={handleChange} 
            type="number" 
            min="0" 
            required 
          />
        </label>
      </div>
      
      <div className={styles.formRow}>
        <label>
          Base Price:
          <input 
            name="price" 
            value={form.price} 
            onChange={handleChange} 
            type="number" 
            min="0" 
            step="0.01" 
            required 
          />
        </label>
        <label>
          Sale Price (Optional):
          <input 
            name="salePrice" 
            value={form.salePrice} 
            onChange={handleChange} 
            type="number" 
            min="0" 
            step="0.01" 
          />
        </label>
      </div>
      
      <div className={styles.formRow}>
        <button type="submit" disabled={isLoading} className={styles.addBtn}>
          {isLoading ? "Updating..." : "Update Product"}
        </button>
        <button type="button" onClick={onCancel} className={`${styles.addBtn} ${styles.cancelBtn}`}>
          Cancel
        </button>
      </div>
      
      {success && <div className={styles.successMsg}>Product updated successfully!</div>}
      {error && <div className={styles.errorMsg}>Error: {error?.data?.message || error.message}</div>}
    </form>
  );
};

export default EditProduct;
