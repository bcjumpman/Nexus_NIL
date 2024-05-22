import "./Footer.css";
import { IoLogoGithub } from "react-icons/io5";
import { BsLinkedin } from "react-icons/bs";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-top">
        <h2 className="contactme-txt">Contact Me</h2>
        <a
          href="https://github.com/bcjumpman/Nexus_NIL.git
          "
          target="_blank"
          rel="noreferrer"
          className="footer-link nexus-git"
        >
          <IoLogoGithub className="github-logo" />
          Nexus
        </a>
      </div>
      <div className="contacts-container">
        <div className="contacts">
          <a
            href="https://github.com/bcjumpman"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            <IoLogoGithub className="github-logo" />
            Bcjumpman
          </a>
          <a
            href="https://www.linkedin.com/in/bcarmichael31/"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            <BsLinkedin className="linkedin-logo" />
            Brian Carmichael
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
