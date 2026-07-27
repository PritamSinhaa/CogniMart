import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './routes/AppRouter'

createRoot(document.getElementById('root')).render(
  
  <RouterProvider router={AppRouter}/>
  
)
