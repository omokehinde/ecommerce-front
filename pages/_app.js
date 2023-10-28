import { CartContextProvider } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components"


const GlobalStyles = createGlobalStyle`
@import 
  url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
body{
    background-color: #eeee;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles suppressHydrationWarning />
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </>
  );
}