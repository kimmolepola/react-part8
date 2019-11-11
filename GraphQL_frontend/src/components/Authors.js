import React, { useState } from 'react';
import Select from 'react-select';

const Authors = ({ show, result, editAuthor, handleError }) => {
  const [selected, setSelected] = useState('');
  const [bornInput, setBornInput] = useState('');
  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;
  const options = authors.reduce((acc, cur) => acc.concat({ value: cur.name, label: cur.name }), []);

  const submit = (e) => {
    e.preventDefault();

    const bornInt = parseInt(bornInput, 10)
    if (bornInt) {
      editAuthor({
        variables: {
          name: selected.value,
          born: bornInt,
        },
      });
    } else {
      handleError("input needs to be a number")
    }
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th />
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <Select value={selected} onChange={(x) => setSelected(x)} options={options} />
      <form onSubmit={submit}>
        born
        <input value={bornInput} onChange={({ target }) => setBornInput(target.value)} />
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
