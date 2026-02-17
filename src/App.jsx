import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CollectionDetail from './pages/CollectionDetail';
import Explore from './pages/Explore';
import ExploreDetail from './pages/ExploreDetail';
import Community from './pages/Community';

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:id" element={<ExploreDetail />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
