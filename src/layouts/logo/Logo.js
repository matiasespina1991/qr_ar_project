import LogoDark from "../../assets/images/logos/amplelogo.svg";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <p style={{ paddingLeft: '0.9rem', fontSize: '1.2rem', paddingTop: '0.1rem'}}>
        <img
          width={30}
          style={{marginRight: '0.7rem'}}
          src="https://www.iconarchive.com/download/i148564/arturo-wibawa/akar/augmented-reality.1024.png"
        />
        {/* <Image src={LogoDark} alt="logo" /> */}
        
        QR.AR
      </p>
    </Link>
  );
};

export default Logo;
