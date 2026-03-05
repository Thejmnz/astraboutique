import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Footer from './components/Footer'
import ProductPage from './pages/ProductPage'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProductsList from './pages/admin/ProductsList'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
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
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
