import React, { useState, useImperativeHandle } from 'react';
import { useQuery } from 'react-apollo';

const Books = React.forwardRef(({ show, genresResult, ALL_BOOKS }, ref) => {
  const [genre, setGenre] = useState('');

  const resetGenre = () => {
    setGenre('');
  }

  useImperativeHandle(ref, () => ({ resetGenre }));

  const booksResult = useQuery(ALL_BOOKS, {variables: {genre: genre} });
  
  if (!show) {
    return null;
  }

  if (booksResult.loading || genresResult.loading){
    return <div>loading...</div>
  }

  const books = booksResult.data.allBooks;
  const genres = genresResult.data.allGenres;

  const Genres = () => {
    return (
    <div>
      {genres.map(x=><button key={x} type="button" onClick={async () => {setGenre(x)}}>{x}</button>)}
      <button type="button" onClick={() => resetGenre()}>all genres</button>
    </div>
    )
  }

  return (
    <div>
      <h2>books</h2>
      <div style={{display: genre === '' ? 'none' : ''}}>in genre <b>{genre}</b></div><p/>
        <table>
        <tbody>
          <tr>
            <th />
            <th>
              <b>author</b>
            </th>
            <th>
              <b>published</b>
            </th>
          </tr>
          {books.map((x, y) =>
              (
                <tr key={x.title.concat(y)}>
                  <td>{x.title}</td>
                  <td>{x.author.name}</td>
                  <td>{x.published}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
      <Genres />
    </div>
  );
});

export default Books;
