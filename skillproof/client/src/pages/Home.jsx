import { Link } from 'react-router-dom';
import { Shield, Briefcase, CheckCircle, Users, Award, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div>
            {/* Hero */}
            <section className="hero-split">
                <div className="hero-gradient-bg"></div>
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        <Shield size={12} />
                        Performance-based skill verification
                    </div>
                    <h1 className="hero-title">
                        The Trust Infrastructure for <span>Digital Skills</span>
                    </h1>
                    <p className="hero-subtitle">
                        SkillProof provides verifiable, performance-based proof of talent. Stop relying on resumes.
                        Start hiring with certainty.
                    </p>
                    <div className="hero-actions left-aligned">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScjYioj0rifIrJKk-1NzBg19XszcpyEJZOtr_qLLFlO6T1spg/viewform?usp=header" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                            Apply as Contender <ArrowRight size={18} />
                        </a>
                        <a href="https://forms.gle/zxdwwzQBwAcRCurU7" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                            <Briefcase size={18} />
                            Hire Verified Talent
                        </a>
                    </div>
                </div>
                <div className="hero-visual">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Professional workspace" className="hero-image" />
                </div>
            </section>

            {/* Feature Cards */}
            <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1200, margin: '0 auto' }}>
                <div className="features-grid" style={{ maxWidth: '100%', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <div className="feature-card">
                        <div className="feature-icon-wrap" style={{ background: 'var(--accent-muted)' }}>
                            <Briefcase size={26} color="var(--black)" />
                        </div>
                        <h3 className="feature-title">Submit Proof</h3>
                        <p className="feature-desc">Professionals link their portfolios and specify their primary skill domain for rigorous manual review.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrap" style={{ background: 'var(--accent-muted)' }}>
                            <Shield size={26} color="var(--black)" />
                        </div>
                        <h3 className="feature-title">Rigorous Verification</h3>
                        <p className="feature-desc">Our expert admin team manually audits and approves only top-tier work, issuing a cryptographic badge.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrap" style={{ background: 'var(--accent-muted)' }}>
                            <CheckCircle size={26} color="var(--black)" />
                        </div>
                        <h3 className="feature-title">Instant Trust</h3>
                        <p className="feature-desc">Employers gain exclusive access to a curated pool of certified professionals ready to hire immediately.</p>
                    </div>
                </div>
            </section>

            {/* Stats Row */}
            <section style={{ borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7', padding: '2.5rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                    {[
                        { value: '100%', label: 'Manually verified' },
                        { value: '3', label: 'Role-based flows' },
                        { value: '0', label: 'Fake credentials' },
                    ].map(({ value, label }) => (
                        <div key={label}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1E3A8A', letterSpacing: '-0.03em' }}>{value}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '2rem 1.5rem' }}>
                <div className="cta-band">
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>
                        Ready to build trust?
                    </h2>
                    <p style={{ color: 'var(--gray-500)', margin: '0 auto 2.5rem', maxWidth: 480, fontSize: '1.05rem' }}>
                        Join hundreds of professionals getting verified and employers hiring with confidence.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScjYioj0rifIrJKk-1NzBg19XszcpyEJZOtr_qLLFlO6T1spg/viewform?usp=header" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                            Apply as Contender
                        </a>
                        <a href="https://forms.gle/zxdwwzQBwAcRCurU7" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                            Hire Verified Talent
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
