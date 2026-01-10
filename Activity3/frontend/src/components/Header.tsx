import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          📚 Bookshelf Manager
        </Link>
        <nav className="nav">
          <Link to="/">Dashboard</Link>
          <Link to="/books">Books</Link>
          <Link to="/authors">Authors</Link>
          <Link to="/categories">Categories</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
