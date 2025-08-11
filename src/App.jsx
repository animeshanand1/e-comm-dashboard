import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import ProductList from "./components/ProductList/ProductList";
import Dashboard from "./components/Dashboard/Dashboard";
// import Analytics from "./components/Analytics/Analytics";
import OrdersPage from "./components/Orders/OrdersPage";
import Settings from "./components/Settings/Settings";
import Inventory from "./components/Inventory/Inventory";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ProtectedRoute>
        <div className={styles.appContainer}>
          <Sidebar />
          <div className={styles.mainContent}>
            <Header />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/featured-products" element={<FeaturedProducts />} />
              {/* <Route path="/analytics" element={<Analytics />} /> */}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </ProtectedRoute>
    </BrowserRouter>
  );
}

export default App;
