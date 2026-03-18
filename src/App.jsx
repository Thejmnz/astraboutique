import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Footer from './components/Footer'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import CustomerLogin from './pages/CustomerLoginPage'
import CustomerRegister from './pages/CustomerLogin'
import AccountPage from './pages/AccountPage'
import BioLinksPage from './pages/BioLinksPage'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProductsList from './pages/admin/ProductsList'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import OrdersPage from './pages/admin/OrdersPage'
import BioLinksAdmin from './pages/admin/BioLinksAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import CartDrawer from './components/CartDrawer'
import WishlistDrawer from './components/WishlistDrawer'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <Router>
          <ScrollToTop />
          <CartDrawer />
          <WishlistDrawer />
          <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute>
                <ProductsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos/nuevo"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos/editar/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/links"
            element={
              <ProtectedRoute>
                <BioLinksAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/links" element={<BioLinksPage />} />
          <Route
            path="/*"
            element={
              <div className="bg-background-light text-[#1A1A1A] font-sans min-h-screen">
                <Header />
                <main>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <Hero />
                          <Products />
                        </>
                      }
                    />
                    <Route path="/producto/:slug" element={<ProductPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/login" element={<CustomerLogin />} />
                    <Route path="/registro" element={<CustomerRegister />} />
                    <Route path="/cuenta" element={<AccountPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
        </WishlistProvider>
      </CartProvider>
  </AuthProvider>
  )
}

export default App
