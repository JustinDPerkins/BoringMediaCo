import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './context/CartContext';
import { WatermarkProvider } from './context/WatermarkContext';
import { theme } from './theme';
import AppBar from './components/AppBar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Submissions from './pages/Submissions';
import Watch from './pages/Watch';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <WatermarkProvider>
          <Router>
            <AppBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/profile" element={<Profile />} />
              {/* Legacy routes for backwards compatibility */}
              <Route path="/products" element={<Library />} />
              <Route path="/cart" element={<Profile />} />
              <Route path="/watermarking" element={<Submissions />} />
            </Routes>
            <ChatBot />
          </Router>
        </WatermarkProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
