import { NavLink } from 'react-router-dom'

function Logo() {
  return (
    <NavLink 
      to="/"   
      className="text-2xl font-bold tracking-tight"
    >
      CogniMart
    </NavLink>
  )
}

export default Logo
