
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store.js'
import { Provider } from 'react-redux'
import {Route,RouterProvider,createRoutesFromElements} from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
//auth
import AdminRoute from './pages/admin/AdminRoute.jsx'
import GenreList from './pages/admin/GenreList.jsx'
import AdminMoviesList from './pages/admin/AdminMoviesList.jsx'
import UpdateMovie from './pages/admin/UpdateMovie.jsx'

//restricted user
import Home from './pages/home.jsx'
import Login from './pages/auth/login.jsx'
import Register from './pages/auth/register.jsx'
import PrivateRoute from './pages/auth/privateroute.jsx'
import Profile from './pages/user/profile.jsx'
import CreateMovie from './pages/admin/CreateMovie.jsx'
import AllMovies from './pages/movies/AllMovies.jsx'
import MovieDetails from './pages/movies/MovieDetails.jsx'
import AllComments from './pages/admin/AllComments.jsx'
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard.jsx'




import Watchlist from './pages/movies/Watchlist.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
    <Route index ={true} path='/' element={<Home/>}/>
    <Route path='/movies'element={<AllMovies/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/movies/:id' element={<MovieDetails/>} />
    <Route path="" element={<PrivateRoute/>}>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/watchlist' element={<Watchlist/>}/>
    </Route>
    <Route path='' element={<AdminRoute/>}>
    <Route path='/admin/movies/genre' element={<GenreList/>} />
     <Route path='/admin/movies/create' element={<CreateMovie/>} />
     <Route path='/admin/movies-list' element={<AdminMoviesList/>} />
     <Route path='/admin/movies/update/:id' element={<UpdateMovie/>} />
      <Route path='/admin/movies/dashboard' element={<AdminDashboard/>} />
     <Route path='/admin/movies/comments' element={<AllComments/>} />
     

    </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
    )
