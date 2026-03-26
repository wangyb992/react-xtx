import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19'
import '@/styles/common.scss'
import './index.css'
import router from './router/index.jsx'

createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />

)
