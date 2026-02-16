import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CollectionDetail from './pages/CollectionDetail';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
