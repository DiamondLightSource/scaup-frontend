import { Providers } from "@/app/providers";
import { AppNavbar } from "@/components/navigation/AppNavbar";
import { Footer } from "@/components/navigation/Footer";
import "@/styles/main.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html style={{ colorScheme: "light" }} data-theme='light'>
      <body className='chakra-ui-light'>
        <Providers>
          <div className='rootContainer'>
            <AppNavbar />
            <div className='main'>{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
