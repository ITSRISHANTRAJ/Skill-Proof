import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const img = document.querySelector('.hero-image');
      if (img) {
        const rotation = window.scrollY / 20;
        img.style.transform = `rotateY(${rotation}deg)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <nav className="nav" style={{ boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
        <div className="nav-logo">SkillProof</div>
        <ul className="nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#editors">For Editors</a></li>
          <li><a href="#hirers">For Teams</a></li>
          <li><a href="#trust">Why Us</a></li>
        </ul>
        <div className="nav-auth">
          <Link href="/login"><button className="secondary">Login</button></Link>
          <Link href="/signup"><button className="primary">Get Verified</button></Link>
        </div>
      </nav>

      <section className="section hero">
        <div className="container fade-in">
          <h1>Showcase Your Editorial Excellence — Verified and Trusted.</h1>
          <p>Submit your best work. Earn an immutable badge that top hiring teams respect.</p>
          <div style={{ perspective: '1000px' }}>
            <img src="https://source.unsplash.com/1200x600/?editorial,3d" alt="Hero visual" className="hero-image" />
          </div>
          <div className="cta">
            <Link href="/signup"><button style={{ background: 'white', color: '#0071e3', fontSize: '1.1rem', padding: '0.875rem 2rem' }}>Start as Editor</button></Link>
            <Link href="/signup"><button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1.1rem', padding: '0.875rem 2rem' }}>I'm Hiring</button></Link>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container fade-in">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-text">
              <h3>Submit Your Portfolio</h3>
              <p>Showcase your best editing work. Upload samples that represent your skills and style.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-text">
              <h3>Complete Our Challenge</h3>
              <p>Test your abilities with a real-world editing challenge. Show us what you can do under pressure.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-text">
              <h3>Get Verified & Earn a Badge</h3>
              <p>Your work is reviewed and scored. Earn an immutable badge that proves your expertise.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-text">
              <h3>Get Discovered by Top Teams</h3>
              <p>Hiring managers search verified editors. Your badge puts you at the top of their list.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="editors" className="section" style={{ background: '#f5f5f7' }}>
        <div className="container fade-in">
          <div className="grid-2">
            <div>
              <h2>For Editorial Professionals</h2>
              <p>Stop getting overlooked. Stand out from 90% of applicants with a verified badge that recruiter trust instantly.</p>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#555' }}>
                <li>Immutable verification badge</li>
                <li>Real-world skill assessment</li>
                <li>Portfolio showcase</li>
                <li>Direct discovery by top teams</li>
              </ul>
              <Link href="/signup"><button className="primary" style={{ marginTop: '1rem' }}>Join as Editor</button></Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #d5d5d7' }}>
                <div style={{ fontSize: '3rem' }}>✓</div>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0071e3' }}>Verified Badge</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Displayed across your profile</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hirers" className="section">
        <div className="container fade-in">
          <div className="grid-2">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#f5f5f7', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem' }}>👥</div>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1d1d1f' }}>Pre-Vetted Talent Pool</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Only editors who passed our challenge</p>
              </div>
            </div>
            <div>
              <h2>For Hiring Teams</h2>
              <p>Eliminate hiring risk. Access a curated pool of verified editors with proven skills and verified badges.</p>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#555' }}>
                <li>Pre-vetted editorial professionals</li>
                <li>Scored by skill level</li>
                <li>Transparent verification process</li>
                <li>Direct contact with top talent</li>
              </ul>
              <Link href="/signup"><button className="primary" style={{ marginTop: '1rem' }}>Browse Verified Editors</button></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="social-proof">
        <div className="container fade-in">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Trusted by Editorial Professionals</h2>
          <div className="grid">
            <div className="quote-card">
              <p className="quote">"This badge changed everything. Recruiters actually noticed my application now."</p>
              <p className="author">— Sarah Chen, Senior Editor</p>
            </div>
            <div className="quote-card">
              <p className="quote">"We hired three amazing editors through SkillProof. The vetting saved us weeks."</p>
              <p className="author">— Marcus Lee, Hiring Manager</p>
            </div>
            <div className="quote-card">
              <p className="quote">"Finally, a way to prove I'm not average. The badge speaks for itself."</p>
              <p className="author">— Amanda Rodriguez, Freelance Editor</p>
            </div>
            <div className="quote-card">
              <p className="quote">"We reduced hiring time by 60%. SkillProof editors come pre-vetted."</p>
              <p className="author">— James Park, Publishing Director</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f5f5f7', textAlign: 'center' }}>
        <div className="container fade-in">
          <h2>Ready to Stand Out?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Join verified editors who've earned the badge that matters.</p>
          <Link href="/signup"><button className="primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Get Verified Today</button></Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#editors">For Editors</a></li>
              <li><a href="#hirers">For Teams</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Compliance</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #d5d5d7', color: '#555', fontSize: '0.9rem' }}>
          <p>&copy; 2026 SkillProof. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
