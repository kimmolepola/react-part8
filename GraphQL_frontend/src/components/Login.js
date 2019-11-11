import React, { useState } from 'react';

const Login = ({ show, login, handleNotification }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  if (!show) {
    return null;
  }
  const submit = (event) => {
    event.preventDefault();
    login({
      variables: {
        username, password,
      },
    });
  handleNotification('submitted!');
  };
  return (
    <div>
      <form onSubmit={submit}>
        <div>
        username
          <input value={username} onChange={(x) => setUsername(x.target.value)} />
        </div>
        <div>
        password
          <input value={password} onChange={(x) => setPassword(x.target.value)} />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default Login;
