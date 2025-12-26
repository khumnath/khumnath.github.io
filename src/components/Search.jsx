import React, { useState } from "react";

// This is a simple search component. For full-featured search, consider integrating Algolia, Lunr.js, or Fuse.js.
const Search = ({ data }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((item) => (
            <li key={item.id}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
