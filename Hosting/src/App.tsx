import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Top from './components/pages/Top';
import Login from './components/pages/Login';
import Logo from './components/ui/Logo';

const App = () => (
  <BrowserRouter>
    <Logo />
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<h1>Not Found Page</h1>} />
    </Routes>
    {/* <Link to="/">Back To Top</Link> | <Link to="/a">aaa</Link> */}
  </BrowserRouter>
);

export default App;
