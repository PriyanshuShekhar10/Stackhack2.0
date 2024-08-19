import './Footer.css'; // Make sure to create a corresponding CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container container grid">
        <ul className="footer__links">
          <li>
            <a href="#home" className="footer__link">Home</a>
          </li>
          <li>
            <a href="#about" className="footer__link">About</a>
          </li>
          <li>
            <a href="#projects" className="footer__link">Project</a>
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