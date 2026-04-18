export default function Navbar() {
  return (
    <nav className="top">
      <a href="#top" className="brand">Anupam<em>*</em></a>
      <div className="links">
        <a href="#about" data-num="01">About</a>
        <a href="#work" data-num="02">Work</a>
        <a href="#projects" data-num="03">Projects</a>
        <a href="#stack" data-num="04">Stack</a>
        <a href="#contact" data-num="05">Contact</a>
      </div>
      <div className="status">Available · IN</div>
    </nav>
  );
}
