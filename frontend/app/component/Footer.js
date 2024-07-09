import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="bg-footer">
        <div className="footer-copyright text-center py-3">&copy; {currentYear} Copyright.<span className="text-dark">Eco Automotive</span></div>
      </footer>
    </>
  );
};

export default Footer;
