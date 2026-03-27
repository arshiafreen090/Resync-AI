import { Linkedin, Github, Twitter, Mail, Briefcase, Send } from 'lucide-react';

export default function Footer() {
  return (
    <div className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Column 1 */}
          <div className="footer-col col-stay-connected">
            <h2 className="footer-heading">Stay Connected</h2>
            <p className="footer-text">Join our newsletter for the latest updates and exclusive offers.</p>
            <form className="footer-form">
              <input type="email" placeholder="Enter your email" className="footer-input" />
              <button type="button" className="footer-submit-btn">
                <Send size={16} />
              </button>
            </form>
            <div className="footer-glow"></div>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h3 className="footer-subheading">Quick Links</h3>
            <div className="footer-nav">
              <a href="#">Home</a>
              <a href="#">About Us</a>
              <a href="#">Services</a>
              <a href="#">Products</a>
              <a href="#">Contact</a>
            </div>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h3 className="footer-subheading">Contact Us</h3>
            <address className="footer-address">
              <p>University of Lucknow</p>
              <p>Email: <a href="mailto:afreenaurshi.creates@gmail.com">afreenaurshi.creates@gmail.com</a></p>
              <p>Afreen Aurshi: <a href="https://afreen.tech" target="_blank" rel="noopener noreferrer">afreen.tech</a></p>
            </address>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h3 className="footer-subheading">Social & Professional</h3>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/in/afreen-aurshi-60477b331/" target="_blank" rel="noopener noreferrer" className="social-btn" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/arshiafreen090" target="_blank" rel="noopener noreferrer" className="social-btn" title="GitHub">
                <Github size={20} />
              </a>
              <a href="https://x.com/afreenaurshi" target="_blank" rel="noopener noreferrer" className="social-btn" title="X (Twitter)">
                <Twitter size={20} />
              </a>
              <a href="https://www.fiverr.com/afreen_creates_?public_mode=true" target="_blank" rel="noopener noreferrer" className="social-btn" title="Fiverr">
                <Briefcase size={20} />
              </a>
              <a href="mailto:afreenaurshi.creates@gmail.com" className="social-btn" title="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 - All rights reserved, Resync ai
          </div>
          <div className="footer-creator">
            Built with care by <span className="creator-name">Afreen Aurshi</span>
          </div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </div>
  )
}
