import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import DownloadAppSection from './components/DownloadAppSection/DownloadAppSection';
import LoginPopup from './components/LoginPopup/LoginPopup';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders/MyOrders';
import Header from './components/Header/Header'; 

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showLogin ? 'hidden' : 'auto';
  }, [showLogin]);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/order-success' element={<OrderSuccess />} />
          <Route path='/myorders' element={<MyOrders />} />

          {/* 👇 Route for Header component after user login */}
          <Route
            path='/header'
            element={
              <>
                <Navbar setShowLogin={setShowLogin} /> {/* optional: show Navbar */}
                <Header />
                <DownloadAppSection />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;



