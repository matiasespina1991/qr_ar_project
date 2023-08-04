import FullLayout from "../src/layouts/FullLayout";
import Head from "next/head";
import "../styles/style.scss";

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>QR AR Dashboard </title>
        <meta
          name="description"
          content="QR AR Dashboard "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     
      
          <Component {...pageProps} />
      
     
    </>
  );
}

export default MyApp;
