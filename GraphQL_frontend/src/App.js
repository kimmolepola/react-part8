import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient, ApolloConsumer, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Recommended from './components/Recommended';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

const App = () => {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('books');
  const handleNotification = (notific) => {
    setNotification(notific);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }
  useEffect(() => {
      setToken(localStorage.getItem('book-app-user-token'));
  },[])



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

  const ME = gql`{me{username, favoriteGenre}}`;
  const ALL_AUTHORS = gql`{allAuthors{name born bookCount}}`;
  const ALL_BOOKS = gql`{allBooks{title, published, author{name}, genres}}`;
  const EDIT_AUTHOR = gql`mutation ($name: String!, $born: Int!){
    editAuthor(
      name: $name,
      setBornTo: $born,
    ){name, born, bookCount}
  }`;
  const CREATE_BOOK = gql`mutation createBook($title: String!, $published: Int, $author: String, $genres: [String!]){
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
  const CREATE_USER = gql`mutation createUser($username: String!, $favGenre: String!){
    createUser(
      username: $username,
      favoriteGenre: $favGenre,
    ) {
      username
    }
  }`;
  const LOGIN = gql`mutation login($username: String!, $password: String!){
    login(
      username: $username,
      password: $password,
    ) {
      token
      user{username, favoriteGenre}
    }
  }`;

  const [login] = useMutation(LOGIN, {
    onError: handleError,
  });
  const [createUser] = useMutation(CREATE_USER, {
    onError: handleError,
  });
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

  const client = useApolloClient();

  const displayIfToken = {display: token ? '' : 'none'};
  const displayIfNoToken = {display: token ? 'none' : '' };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('login');
  };

  useEffect(() => {
    if (token) {
      const queryUser = async () => {
        const usr = await client.query({ query: ME, fetchPolicy: 'no-cache' })
        setUser(usr.data.me);
        handleNotification(`logged in as ${usr.data.me.username}`)
      }
      queryUser();
    } else {
      setUser(null);       
    }
  }, [token])

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
        <button style={displayIfToken} type="button" onClick={() => setPage('add')}>add book</button>
        <button style={displayIfNoToken} type="button" onClick={() => setPage('createUser')}>register new user</button>
        <button style={displayIfNoToken} type="button" onClick={() => setPage('login')}>login</button>
        <button style={displayIfToken} type="button" onClick={() => setPage('recommended')}>recommended</button>
        <button style={displayIfToken} type="button" onClick={() => handleLogout()}>logout</button>
      </div>

      <div>
        <Authors
          displayIfToken={displayIfToken}
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
          handleNotification={handleNotification}
          addBook={addBook}
          show={page === 'add'}
        />

        <Recommended
          user={user}
          bookResult={books}
          show={page === 'recommended'}
        />

        <CreateUser
          handleNotification={handleNotification}
          createUser={createUser}
          show={page === 'createUser'}
        />

        <Login
          setPage={setPage}
          setToken={setToken}
          handleNotification={handleNotification}
          login={login}
          show={page === 'login'}
        />
      </div>
    </div>
  );
};

export default App;
