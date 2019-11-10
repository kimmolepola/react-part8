import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

const App = () => {
  const ALL_AUTHORS = gql`{allAuthors{name born bookCount}}`;
  const ALL_BOOKS = gql`{allBooks{title, published, author}}`;
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
      author
      genres
    }
  }`;

  const handleError = (x) => {
    console.log(x);
  };

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
      <div>
        <button type="button" onClick={() => setPage('authors')}>authors</button>
        <button type="button" onClick={() => setPage('books')}>books</button>
        <button type="button" onClick={() => setPage('add')}>add book</button>
      </div>

      <div>
        <Authors
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
      </div>
    </div>
  );
};

export default App;
