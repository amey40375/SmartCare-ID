import { useLocation } from "wouter";
import { useEffect } from "react";

const NotFound = () => {
  const [location] = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    );
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-white">404</span>
        </div>
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
        </p>
        <a href="/" className="inline-block">
          <button className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all">
            🏠 Kembali ke Beranda
          </button>
        </a>
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Butuh bantuan? Hubungi kami:</p>
          <p>📧 id.smartprobyarvin@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
