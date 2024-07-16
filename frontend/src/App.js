import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/homePage.js';
import ImageBlurPage from './components/imageBlurPage.js';
import Header from './components/header.js';
import Footer from './components/footer.js';
import NotFoundPage from './components/notFoundPage.js';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/image-blur" element={<ImageBlurPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
