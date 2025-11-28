export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {year} Issam. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
