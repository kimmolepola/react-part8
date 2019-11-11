import React, { useState } from 'react';

const CreateUser = ({ show, createUser, handleNotification }) => {
  const [username, setUsername] = useState('');
  const [favGenre, setFavGenre] = useState('');
  if (!show) {
    return null;
  }
  const submit = (event) => {
    event.preventDefault();
    createUser({
      variables: {
        username, favGenre,
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
        favourite genre
          <input value={favGenre} onChange={(x) => setFavGenre(x.target.value)} />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default CreateUser;
