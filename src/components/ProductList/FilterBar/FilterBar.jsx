import React, { useRef, useState } from "react";
import { useBulkCreateProductsMutation } from "../../../store/api/apiSlice";
import styles from "./FilterBar.module.css";

import * as XLSX from 'xlsx';

const handleExport = (products) => {
  const ws = XLSX.utils.json_to_sheet(products);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  XLSX.writeFile(wb, "products.xlsx");
};

const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const FilterBar = ({ products = [], onFilterChange }) => {
  const fileInputRef = useRef(null);
  const [bulkCreateProducts, { isLoading: isBulkUploading }] = useBulkCreateProductsMutation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Remove empty filters before sending to parent
    const activeFilters = Object.entries(newFilters).reduce((acc, [k, v]) => {
      if (v && v !== '') {
        acc[k] = v;
      }
      return acc;
    }, {});
    
    onFilterChange(activeFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(clearedFilters);
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const handleBulkUpload = async (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
    if (!file) return;

    try {
      console.log('Starting to parse Excel file...');
      const excelData = await parseExcelFile(file);
      console.log('Excel data parsed:', excelData);
      
      // Transform Excel data to match your backend product schema
      const transformedProducts = excelData.map(row => ({
        sku: row.SKU || row.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: row.Name || row.name || row.productName,
        brand: row.Brand || row.brand,
        description: row.Description || row.description || '',
        category: {
          primary: row.CategoryPrimary || row.category || row.Category,
          secondary: row.CategorySecondary || row.secondaryCategory || ''
        },
        pricing: {
          basePrice: parseFloat(row.BasePrice || row.price || row.Price || 0),
          salePrice: row.SalePrice ? parseFloat(row.SalePrice) : undefined,
          currency: row.Currency || row.currency || 'USD'
        },
        productType: row.ProductType || row.type || 'physical',
        status: row.Status || row.status || 'active',
        variants: [{
          attributes: {
            color: row.Color || row.color || '',
            size: row.Size || row.size || ''
          },
          inventory: {
            quantity: parseInt(row.Stock || row.quantity || row.Quantity || 0, 10),
            trackInventory: true
          },
          pricing: {
            basePrice: parseFloat(row.BasePrice || row.price || row.Price || 0),
            salePrice: row.SalePrice ? parseFloat(row.SalePrice) : undefined
          },
          images: row.ImageURL ? [{
            url: row.ImageURL,
            alt: row.Name || row.name,
            isPrimary: true,
            type: 'front',
            order: 1
          }] : []
        }]
      }));

      console.log('Transformed products:', transformedProducts);
      console.log('About to call bulkCreateProducts API...');
      
      const result = await bulkCreateProducts(transformedProducts).unwrap();
      console.log('API response:', result);
      alert(`Successfully uploaded ${transformedProducts.length} products!`);
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Error uploading products: ' + (error?.data?.message || error.message));
    }
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterBarTitle}>Product Management</h3>
        <div className={styles.filterActions}>
          <button 
            className={`${styles.actionBtn} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="fa-solid fa-filter"></i>
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className={styles.activeFiltersCount}>
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          <button className={styles.actionBtn} onClick={() => handleExport(products)}>
            <i className="fa-solid fa-download"></i>
            <span>Export</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleBulkUpload}
            style={{ display: 'none' }}
          />
          <button 
            className={styles.actionBtn} 
            onClick={() => fileInputRef.current?.click()}
            disabled={isBulkUploading}
          >
            <i className="fa-solid fa-upload"></i>
            <span>{isBulkUploading ? 'Uploading...' : 'Upload'}</span>
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Search Products</label>
              <input
                type="text"
                placeholder="Search by name, SKU, brand..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>Category</label>
              <input
                type="text"
                placeholder="Filter by category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Products</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Min Price ($)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>Max Price ($)</label>
              <input
                type="number"
                placeholder="999.99"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>&nbsp;</label>
              <button className={styles.clearBtn} onClick={clearFilters}>
                <i className="fa-solid fa-refresh"></i>
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FilterBar;
