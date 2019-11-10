import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

const App = () => {
  const ALL_AUTHORS = gql`{allAuthors{name born bookCount}}`;
  const ALL_BOOKS = gql`{allBooks{title, published, author}}`;
  const CREATE_BOOK = gql`mutation createBook($title: String!, $published: Int, $author: String, $genres: [String!]){
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

  const handleError = () => {

  };

  const [page, setPage] = useState('authors');
  const [addBook] = useMutation(CREATE_BOOK, { onError: handleError, refetchQueries: [{ query: ALL_AUTHORS }] });
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
