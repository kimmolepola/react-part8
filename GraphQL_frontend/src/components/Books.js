import React, { useState } from 'react';

const Books = ({ show, result }) => {
  const [genre, setGenre] = useState(null);
  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;
  const genres = Object.keys(books.reduce((acc, cur) => {
    cur.genres.map(x => acc[x] = true);
    return acc;
  }, {}));

  const Genres = () => {
    return (
    <div>
      {genres.map(x=><button key={x} type="button" onClick={() => setGenre(x)}>{x}</button>)}
      <button type="button" onClick={() => setGenre(null)}>all genres</button>
    </div>
    )
  }



  return (
    <div>
      <h2>books</h2>
      <div style={{display: genre ? '' : 'none'}}>in genre <b>{genre}</b></div><p/>
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
          {books.map((x) => {
            if (genre === null || x.genres.includes(genre)){
              return (
                <tr key={x.title}>
                  <td>{x.title}</td>
                  <td>{x.author.name}</td>
                  <td>{x.published}</td>
                </tr>
              )
            }
            return null;
          })}
        </tbody>
      </table>
      <Genres />
    </div>
  );
};

export default Books;
