import { Link } from 'react-router-dom';
import { Shield, Users, CheckCircle, Lock, Zap, Globe } from 'lucide-react';

export default function About() {
    const steps = [
        { icon: <Users size={20} />, title: 'Register', desc: 'Professionals sign up and specify their primary skill domain.' },
        { icon: <Shield size={20} />, title: 'Apply', desc: 'Submit your portfolio URL and relevant experience for review.' },
        { icon: <CheckCircle size={20} />, title: 'Get Verified', desc: 'SkillProof admin manually reviews and approves your submission.' },
        { icon: <Zap size={20} />, title: 'Earn Your Badge', desc: 'Receive a unique, cryptographically signed SkillProof badge.' },
    ];

    const values = [
        { icon: <Lock size={22} color="#1E3A8A" />, title: 'Zero Fluff', desc: 'We only verify real, demonstrable skills — no self-assessment, no quizzes.' },
        { icon: <Users size={22} color="#1E3A8A" />, title: 'Human-First', desc: 'Every application is reviewed by a real person, not an algorithm.' },
        { icon: <Globe size={22} color="#1E3A8A" />, title: 'Transparent', desc: 'Clear process, clear criteria, clear outcomes. No black boxes.' },
    ];

    return (
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', padding: '4rem 0 3rem' }}>
                <div className="hero-eyebrow" style={{ display: 'inline-flex' }}>About SkillProof</div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginTop: '1rem', marginBottom: '1rem' }}>
                    Building the gold standard for skill trust
                </h1>
                <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>
                    SkillProof exists because resumes lie and credentials are inflated.
                    We built a platform where talent speaks for itself — verified by humans, backed by performance.
                </p>
            </div>

            {/* Mission */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 className="section-title">Our Mission</h2>
                <p style={{ color: '#374151', lineHeight: 1.8 }}>
                    Every year, employers make costly hiring mistakes because credentials are impossible to verify.
                    SkillProof closes this gap by creating a performance-based trust layer — where professionals
                    prove their skills through real work output, and employers can hire knowing exactly what they're getting.
                </p>
            </div>

            {/* How it works */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="section-title">How It Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {steps.map((step, i) => (
                        <div key={i} className="card" style={{ textAlign: 'center' }}>
                            <div style={{ width: 44, height: 44, background: 'rgba(30,58,138,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#1E3A8A' }}>
                                {step.icon}
                            </div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1E3A8A', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step {i + 1}</div>
                            <h3 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{step.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Values */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 className="section-title">Our Values</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {values.map((v, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.25rem', border: '1px solid #E4E4E7', borderRadius: 12, background: '#FAFAFA' }}>
                            <div style={{ width: 44, height: 44, background: 'rgba(30,58,138,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {v.icon}
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{v.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{v.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', padding: '2rem 0 3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to prove your skills?</h2>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                    <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
