import Link from 'next/link';
export default function Home() {
  return (
    <div className="container">
      <h1>Welcome</h1>
      <Link href="/login">Login</Link> | <Link href="/signup">Sign up</Link>
    </div>
  );
}
