import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription, useApolloClient } from 'react-apollo';
import { gql } from 'apollo-boost';
import Recommended from './components/Recommended';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

const App = () => {
  
  const client = useApolloClient();

  const [user, setUser] = useState({ favoriteGenre: null });
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('books');

  useEffect(() => {
    setToken(localStorage.getItem('book-app-user-token'));
  },[])

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('login');
  };

  const handleNotification = (notific) => {
    setNotification(notific);
    setTimeout(() => {
      setNotification(null);
    }, 10000);
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

  const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
      title
      published
      author {name}
      genres
      id
    }
  `
  const ALL_GENRES = gql`{allGenres}`;
  const ME = gql`{me{username, favoriteGenre}}`;
  const ALL_AUTHORS = gql`{allAuthors{name born bookCount}}`;
  const ALL_BOOKS = gql`query allBooks($genre: String){allBooks(genre: $genre){title, published, author{name}, genres, id}}`;
  const BOOK_ADDED = gql`
    subscription {
      bookAdded {
        ...BookDetails
      }
    }
    ${BOOK_DETAILS}
    `
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
      id
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
      value
    }
  }`;

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded;
      const content = `title: ${book.title}, author: ${book.author.name}, published: ${book.published}, genres: ${book.genres.join(', ')}`
      handleNotification(`book added: ${content}`)
      setPage('books')
    }
  })

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
    refetchQueries: [
      { query: ALL_AUTHORS }, 
      { query: ALL_BOOKS, variables: { genre: '' } },
      { query: ALL_BOOKS, variables: { genre: user.favoriteGenre } }, 
      { query: ALL_GENRES }],
  });

  const authors = useQuery(ALL_AUTHORS);
  const genresResult = useQuery(ALL_GENRES);

  useEffect(() => {
    if (token) {
      const setupUser = async () => {
        const usr = (await client.query({ query: ME, fetchPolicy: 'no-cache' })).data.me;
        setUser(usr);
        handleNotification(`logged in as ${usr.username}`)
      }
      setupUser();
    } else {
      setUser({ favoriteGenre: null });
    }
  }, [token, ME, client])

  const displayIfUser = {display: user ? '' : 'none'};
  const displayIfNoUser = {display: user ? 'none' : '' };

  const booksGenreResetRef = React.createRef();

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
        <button type="button" onClick={() => {
          setPage('books');
          booksGenreResetRef.current.resetGenre();
          }}>books</button>
        <button style={displayIfUser} type="button" onClick={() => setPage('add')}>add book</button>
        <button style={displayIfUser} type="button" onClick={() => setPage('recommended')}>recommended</button>
        <button style={displayIfUser} type="button" onClick={() => handleLogout()}>logout</button>
        <button style={displayIfNoUser} type="button" onClick={() => setPage('createUser')}>register new user</button>
        <button style={displayIfNoUser} type="button" onClick={() => setPage('login')}>login</button>
      </div>

      <div>
        <Authors
          displayIfUser={displayIfUser}
          handleError={handleError}
          editAuthor={editAuthor}
          result={authors}
          show={page === 'authors'}
        />

        <Books
          ref={booksGenreResetRef}
          ALL_BOOKS={ALL_BOOKS}
          genresResult={genresResult}
          show={page === 'books'}
        />

        <NewBook
          addBook={addBook}
          show={page === 'add'}
        />

        <Recommended
          client={client}
          ALL_BOOKS={ALL_BOOKS}
          user={user}
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
          login={login}
          show={page === 'login'}
        />
      </div>
    </div>
  );
};

export default App;
