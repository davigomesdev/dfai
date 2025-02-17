import Navbar from '@/components/partials/navbar';
import Footer from '@/components/partials/footer';

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<Readonly<LayoutProps>> = ({ children }) => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <Navbar />
      <section className="w-full flex-1">{children}</section>
      <Footer />
    </main>
  );
};

export default RootLayout;
