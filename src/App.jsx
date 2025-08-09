import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from "./App.module.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import ProductList from "./components/ProductList/ProductList";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header/>
        <ProductList/>
      </div>
    </div>
  );
}

export default App;
