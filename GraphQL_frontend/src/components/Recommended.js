import React from 'react';
import { useQuery } from 'react-apollo';

const Recommended = ({show, user, ALL_BOOKS }) => {
    const genre = user ? user.favoriteGenre : null;

    const result = useQuery(ALL_BOOKS, { variables: { genre: user.favoriteGenre} });

    if (!show){
        return null;
    }

    if (result.loading){
        return <div>loading...</div>
    }

    const books = result.data.allBooks;

    if (!books || books.length === 0){
        return <div><p/>no books in your favorite genre <b>{genre}</b></div>
    }

    return (
        <div>
            <h2>recommendations</h2>
            books in your favorite genre <b>{genre}</b>
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
                {books.map((x, y) =>  (
                        <tr key={x.title.concat(y)}>
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