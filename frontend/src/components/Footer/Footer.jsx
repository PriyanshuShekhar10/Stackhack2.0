import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container container grid">
        <ul className="footer__links">
          <li>
            <a href="/" className="footer__link">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="footer__link">
              About
            </a>
          </li>
        </ul>
        <span className="footer__copy">
          &#169; All Rights Reserved By
          <a href="#"> 1810Code</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
