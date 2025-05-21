import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3">
      <div className="container">
        <p className="mb-0">&copy; {new Date().getFullYear()} Thanachon. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
