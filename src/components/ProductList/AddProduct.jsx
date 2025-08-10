import React, { useState } from "react";
import { useCreateProductMutation } from "../../store/api/apiSlice";
import styles from "./AddProduct.module.css";

const initialState = {
  sku: "",
  name: "",
  brand: "",
  description: "",
  categoryPrimary: "",
  categorySecondary: "",
  basePrice: "",
  salePrice: "",
  currency: "USD",
  productType: "physical",
  status: "active",
  stock: "",
  images: ["", "", "", ""],
  variantColor: "",
  variantSize: "",
};

const AddProduct = ({ onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [createProduct, { isLoading, error }] = useCreateProductMutation();
  const [success, setSuccess] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("image")) {
      const idx = parseInt(name.replace("image", ""), 10);
      const newImages = [...form.images];
      newImages[idx] = value;
      setForm({ ...form, images: newImages });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
  
    if (form.images.filter((img) => img.trim()).length < 4) {
      alert("Please provide at least 4 image URLs.");
      return;
    }
    const product = {
      sku: form.sku,
      name: form.name,
      brand: form.brand,
      description: form.description,
      category: {
        primary: form.categoryPrimary,
        secondary: form.categorySecondary,
      },
      pricing: {
        basePrice: parseFloat(form.basePrice),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        currency: form.currency,
      },
      productType: form.productType,
      status: form.status,
      variants: [
        {
          variantId: `${form.sku}-1`,
          sku: form.sku,
          attributes: [
            ...(form.variantColor ? [{ name: "color", value: form.variantColor }] : []),
            ...(form.variantSize ? [{ name: "size", value: form.variantSize }] : [])
          ],
          inventory: {
            quantity: parseInt(form.stock, 10),
            trackInventory: true,
          },
          pricing: {
            basePrice: parseFloat(form.basePrice),
            salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
          },
          images: form.images.map((url, i) => ({
            url,
            alt: form.name,
            isPrimary: i === 0,
            type: ["front", "back", "side", "detail"][i] || "detail",
            order: i + 1,
          })),
        },
      ],
    };
    try {
      await createProduct(product).unwrap();
      setForm(initialState);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setSuccess(false);
    }
  };

  return (
    <form className={styles.addProductForm} onSubmit={handleSubmit}>
      <h3>Add New Product</h3>
      <div className={styles.formRow}>
        <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" required />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
      </div>
      <div className={styles.formRow}>
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" required />
        <input name="basePrice" value={form.basePrice} onChange={handleChange} placeholder="Base Price" type="number" min="0" step="0.01" required />
        <input name="salePrice" value={form.salePrice} onChange={handleChange} placeholder="Sale Price" type="number" min="0" step="0.01" />
      </div>
      <div className={styles.formRow}>
        <input name="categoryPrimary" value={form.categoryPrimary} onChange={handleChange} placeholder="Primary Category" required />
        <input name="categorySecondary" value={form.categorySecondary} onChange={handleChange} placeholder="Secondary Category" />
        <select name="currency" value={form.currency} onChange={handleChange} required className={styles.select}>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div className={styles.formRow}>
        <select name="productType" value={form.productType} onChange={handleChange} required className={styles.select}>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange} required className={styles.select}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" min="0" required />
      </div>
      <div className={styles.formRow}>
        <input name="variantColor" value={form.variantColor} onChange={handleChange} placeholder="Variant Color (e.g. Red)" />
        <input name="variantSize" value={form.variantSize} onChange={handleChange} placeholder="Variant Size (e.g. M)" />
      </div>
      <div className={styles.formRow}>
        <input name="image0" value={form.images[0]} onChange={handleChange} placeholder="Image URL (Front)" required />
        <input name="image1" value={form.images[1]} onChange={handleChange} placeholder="Image URL (Back)" required />
      </div>
      <div className={styles.formRow}>
        <input name="image2" value={form.images[2]} onChange={handleChange} placeholder="Image URL (Side)" required />
        <input name="image3" value={form.images[3]} onChange={handleChange} placeholder="Image URL (Other)" required />
      </div>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={3} required />
      <button type="submit" disabled={isLoading} className={styles.addBtn}>
        {isLoading ? "Adding..." : "Add Product"}
      </button>
      {success && <div className={styles.successMsg}>Product added successfully!</div>}
      {error && <div className={styles.errorMsg}>Error: {error?.data?.message || error.message}</div>}
    </form>
  );
};

export default AddProduct;
