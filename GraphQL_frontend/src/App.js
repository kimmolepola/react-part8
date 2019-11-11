import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

const App = () => {
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleNotification = (notific) => {
    setNotification(notific);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }
  const handleError = (error) => {
    if (error.graphQLErrors && error.graphQLErrors[0]) {
      setErrorMessage(error.graphQLErrors[0].message);
    } else {
      setErrorMessage(error.toString());
    }
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  const ALL_AUTHORS = gql`{allAuthors{name born bookCount}}`;
  const ALL_BOOKS = gql`{allBooks{title, published, author{name}}}`;
  const EDIT_AUTHOR = gql`mutation ($name: String!, $born: Int!){
    editAuthor(
      name: $name,
      setBornTo: $born,
    ){name, born, bookCount}
  }`;
  const CREATE_BOOK = gql`mutation ($title: String!, $published: Int, $author: String, $genres: [String!]){
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres,
    ){
      title
      published
      author {name}
      genres
    }
  }`;
  const CREATE_USER = gql`mutation ($username: String!, $favGenre: String!){
    createUser(
      username: $username,
      favoriteGenre: $favGenre,
    ) {
      username
    }
  }`;
  const LOGIN = gql`mutation ($username: String!, $password: String!){
    login(
      username: $username,
      password: $password,
    ) {
      value
    }
  }`;

  const [login] = useMutation(LOGIN, {
    onError: handleError,
  });
  const [createUser] = useMutation(CREATE_USER, {
    onError: handleError,
  });
  const [page, setPage] = useState('authors');
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });
  const books = useQuery(ALL_BOOKS);
  const authors = useQuery(ALL_AUTHORS);

  return (
    <div>
      {notification && (
        <div style={{ color: 'green' }}>
          {notification}
        </div>
      )}
      {errorMessage
        && (
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
        )}
      <div>
        <button type="button" onClick={() => setPage('authors')}>authors</button>
        <button type="button" onClick={() => setPage('books')}>books</button>
        <button type="button" onClick={() => setPage('add')}>add book</button>
        <button type="button" onClick={() => setPage('createUser')}>register user</button>
        <button type="button" onClick={() => setPage('login')}>login</button>
      </div>

      <div>
        <Authors
          handleError={handleError}
          editAuthor={editAuthor}
          result={authors}
          show={page === 'authors'}
        />

        <Books
          result={books}
          show={page === 'books'}
        />

        <NewBook
          addBook={addBook}
          show={page === 'add'}
        />

        <CreateUser
          handleNotification={handleNotification}
          createUser={createUser}
          show={page === 'createUser'}
        />

        <Login
          handleNotification={handleNotification}
          login={login}
          show={page === 'login'}
        />
      </div>
    </div>
  );
};

export default App;
