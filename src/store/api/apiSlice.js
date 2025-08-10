import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:5000/api'; 

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
   
      const token = getState().auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Admin', 'Product', 'Category', 'Dashboard', 'Inventory'],
  endpoints: (builder) => ({
 
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Admin'],
    }),

    getDashboard: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['Dashboard'],
    }),
    getProducts: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/admin/products${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Product'],
    }),

    getProductById: builder.query({
      query: (id) => `/admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/admin/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product', 'Dashboard', 'Inventory'],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
        'Dashboard',
        'Inventory',
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Dashboard', 'Inventory'],
    }),

    bulkCreateProducts: builder.mutation({
      query: (products) => ({
        url: '/admin/products/bulk',
        method: 'POST',
        body: products,
      }),
      invalidatesTags: ['Product', 'Dashboard', 'Inventory'],
    }),

    getInventory: builder.query({
      query: () => '/admin/inventory',
      providesTags: ['Inventory'],
    }),

    updateInventory: builder.mutation({
      query: ({ productId, variantId, ...updateData }) => ({
        url: `/admin/inventory/${productId}/${variantId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Inventory', 'Product', 'Dashboard'],
    }),

    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),

    getCategoryTree: builder.query({
      query: () => '/categories/tree',
      providesTags: ['Category'],
    }),

    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetDashboardQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkCreateProductsMutation,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
} = apiSlice;
