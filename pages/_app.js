import FullLayout from "../src/layouts/FullLayout";
import '../styles/style.scss'

function MyApp({ Component, pageProps }) {
  return (
    <FullLayout>
      <Component {...pageProps} />
    </FullLayout>
  );
}

export default MyApp;





// import FullLayout from "../src/layouts/FullLayout";
// import Head from "next/head";
// import "../styles/style.scss";

// function MyApp({ Component, pageProps }) {
//   const isARView = Component.isARView;

//   return (
//     <>
//       <Head>
//         <title>QR AR Dashboard </title>
//         <meta
//           name="description"
//           content="QR AR Dashboard "
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       {isARView ? (
//         <Component {...pageProps} />
//       ) : (
//         <FullLayout>
//           <Component {...pageProps} />
//         </FullLayout>
//       )}
//     </>
//   );
// }

// export default MyApp;
