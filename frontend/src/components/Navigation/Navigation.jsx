import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../../../../images/Logo.png';
import "./Navigation.css";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation-container'>
    <div>
        <h1>Hostels to Houses</h1>
        <NavLink to='/'><img src={logo} alt='AppLogo'/></NavLink>
    </div>
    <ul>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    </div>

  );
      }


export default Navigation;
