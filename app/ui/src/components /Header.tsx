export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 " >

            <nav >
                <ul className="flex items-center gap-2">
                    <li>home</li>
                    <li>contato</li>
                    <li>sobre</li>
                </ul>
            </nav>
        </header>
    ) 
}