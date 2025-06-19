import Link from 'next/link';
const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Log In', href: '/auth/signin' },
        currentUser && { label: 'Log Out', href: '/auth/signout' },
    ]
        .filter((linkConfig) => linkConfig)
        .map(({ label, href }) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href} className="nav-link">
                        {label}
                    </Link>
                </li>
            );
        })
    return (
        <div className="navbar navbar-light bg-light mb-4 px-4">
            <Link href="/" className="navbar-brand">
                Ticketing
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </div>
    );
}

export default Header