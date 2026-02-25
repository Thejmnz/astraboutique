import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Footer from './components/Footer'
import ProductPage from './pages/ProductPage'

function App() {
  return (
    <Router>
      <div className="bg-background-light text-[#1A1A1A] font-sans min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Products />
              </>
            } />
            <Route path="/producto/:id" element={<ProductPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
