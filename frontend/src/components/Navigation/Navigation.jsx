import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

import H2hLogo from '../../../public/H2hLogo.png'
import "./Navigation.css";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation-container'>
    <div>
        <h1>Hostels to Houses</h1>
        <NavLink to='/'><img src={H2hLogo} alt='AppLogo'/></NavLink>
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
