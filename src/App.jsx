import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "./store/slices/uiSlice";
import styles from "./App.module.css";


import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import ProductList from "./components/ProductList/ProductList";
import Dashboard from "./components/Dashboard/Dashboard";
import Analytics from "./components/Analytics/Analytics";
import Orders from "./components/Orders/Orders";
import Settings from "./components/Settings/Settings";
import Categories from "./components/Categories/Categories";
import Inventory from "./components/Inventory/Inventory";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const activePage = useSelector((state) => state.ui.currentPage);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  let ContentComponent = null;
  if (activePage === "Dashboard") {
    ContentComponent = <Dashboard />;
  } else if (activePage === "Products") {
    ContentComponent = <ProductList />;
  } else if (activePage === "Analytics") {
    ContentComponent = <Analytics />;
  } else if (activePage === "Orders") {
    ContentComponent = <Orders />;
  } else if (activePage === "Settings") {
    ContentComponent = <Settings />;
  } else if (activePage === "Categories") {
    ContentComponent = <Categories />;
  } else if (activePage === "Inventory") {
    ContentComponent = <Inventory />;
  } else {
    ContentComponent = <div style={{ padding: "2rem" }}><h2>{activePage}</h2><p>Content coming soon.</p></div>;
  }

  return (
    <ProtectedRoute>
      <div className={styles.appContainer}>
        <Sidebar activeLink={activePage} setActiveLink={handlePageChange} />
        <div className={styles.mainContent}>
          <Header />
          {ContentComponent}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default App;
