import { BrowserRouter, Route, Routes } from 'react-router-dom';

// page
import { Top } from './components/pages/Top';
import { Login } from './components/pages/Login';
import { Mypage } from './components/pages/Mypage';

// ui
import Header from './components/ui/Header';
import Logo from './components/ui/Logo';

const App = () => (
  <BrowserRouter>
    <Header />
    <div id="contents">
      <Logo />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="login" element={<Login />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Routes>
    </div>
    {/* <Link to="/">Back To Top</Link> | <Link to="/a">aaa</Link> */}
  </BrowserRouter>
);

export default App;
