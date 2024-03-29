import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Header from './components/Header'
import FooterN from './components/FooterN'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import Posts from './pages/Posts'
import Scrolltop from './components/Scrolltop'


export default function App() {
  return (
    <BrowserRouter>
    <Scrolltop/>
    <Header/>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/about' element ={<About/>}/>
        <Route path='/signin' element = {<SignIn/>}/>
        <Route path='/signup' element = {<SignUp/>}/>
        <Route element={<PrivateRoute/>}>
        <Route path='/dashboard' element = {<Dashboard/>}/>
        </Route>
        <Route element={<AdminPrivateRoute/>}>
        <Route path='/create-post' element = {<CreatePost/>}/>
        </Route>
        <Route element={<AdminPrivateRoute/>}>
        <Route path='/update-post/:postId' element = {<UpdatePost/>}/>
        </Route>
        <Route path='/projects' element ={<Projects/>}/>
        <Route path='/post/:postSlug' element ={<Posts/>}/>
      </Routes>
      <FooterN/>
    </BrowserRouter>
  )
}
