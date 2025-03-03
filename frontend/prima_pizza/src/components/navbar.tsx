// Default Imports
import Link from "next/link";

const Navbar = () => {
  
  return (
    <nav style={{ padding: "10px", display: "flex", gap: "15px" }}>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}


export default Navbar;
