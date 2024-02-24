import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import CreateSpotForm from '../CreateSpot/CreateSpotForm';
import H2hLogo from '../../../../images/H2HLogo.png'
import "./Navigation.css";


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);



  return (
    <>
    <div className='navigation-container'>
    <div className='title-logo'>
        <h1>Hostels to Houses</h1>
      <NavLink to='/'><img src={H2hLogo} alt='AppLogo'/></NavLink>
    </div>
    <NavLink to='/spots/new'><button className='create-spot'>Create a New Spot</button></NavLink>
    <ul>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    </div>
    </>
  );
      }


export default Navigation;
