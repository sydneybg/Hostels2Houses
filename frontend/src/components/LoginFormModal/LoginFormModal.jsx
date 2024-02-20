import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    // console.log(credential, 'cred')
    // console.log(password, 'pass')
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(res)
        if (res.status === 401) {
          setErrors({credential: data.message});
        }
      });
  };

  const demoLogin = () => {
    dispatch(sessionActions.login({
      credential: "demo@user.io",
      password: 'password'
    }))
    .then(closeModal)
  }


  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={password.length < 6 || credential.length < 4}>Log In</button>
        <a href="#" onClick={demoLogin}>Demo User</a>
      </form>
    </>
  );
}

export default LoginFormModal;
