import React from 'react';
import { useQuery } from 'react-apollo';

const Recommended = ({show, bookResult, user }) => {
    if (!show){
        return null;
    }
    if (bookResult.loading || user === null){
        return <div>loading...</div>
    } 

    const books = bookResult.data.allBooks;
    const matchingBooks = books.filter(x=> x.genres.includes(user.favoriteGenre));

    if (matchingBooks.length === 0){
        return <div><p/>no books in your favorite genre <b>{user.favoriteGenre}</b></div>
    }

    return (
        <div>
            <h2>recommendations</h2>
            books in your favorite genre <b>{user.favoriteGenre}</b>
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
                {matchingBooks.map((x) =>  (
                        <tr key={x.title}>
                        <td>{x.title}</td>
                        <td>{x.author.name}</td>
                        <td>{x.published}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </div>
    )
}

export default Recommended;