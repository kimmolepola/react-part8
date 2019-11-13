import React, { useState } from 'react';

const Login = ({ show, login, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  if (!show) {
    return null;
  }
  const submit = async (event) => {
    event.preventDefault();
    const result = await login({
      variables: {
        username, password,
      },
    });

    if (result){
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('book-app-user-token', token);
      setUsername('');
      setPassword('');
      setPage('books');
    }
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
          <input type="password" value={password} onChange={(x) => setPassword(x.target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
