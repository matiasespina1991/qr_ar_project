import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import {
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
  increment,
} from "firebase/firestore";
import { firestore } from "../../src/config/firebaseConfig";
import Head from "next/head";

export async function getServerSideProps(context) {
  const docId = context.query.docId;

  if (docId) {
    const docRef = doc(firestore, "models", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        props: {
          modelId: docId,
          glbUrl: data.files.glb.url,
          usdzUrl: data.files.usdz.url,
          initialYPosition: data.initialYPosition || 0,
          isInteriorModel: data.isInteriorModel,
          placement: data.placement,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }

  return {
    notFound: true,
  };
}

function ARView({
  modelId,
  glbUrl,
  usdzUrl,
  placement,
  initialYPosition,
  isInteriorModel,
}) {
  const router = useRouter();

  useEffect(() => {
    if (!glbUrl) {
      router.replace("/404");
    } else {
      const updateViewCount = async () => {
        if (modelId) {
          const docRef = doc(firestore, "models", modelId);
          await updateDoc(docRef, {
            "views.total": increment(1),
            "views.lastViewed": serverTimestamp(),
          });
        }
      };

      updateViewCount();
    }
  }, [glbUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!glbUrl) {
    return null;
  }

  return (
    <>
      <Head>
        <title>AR View</title>
        <meta name="description" content="AR View Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Script
            src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
            type="module"
          />
          <model-viewer
            src={glbUrl}
            auto-rotate
            autoplay
            ar-placement={placement === "wall" ? "wall" : "floor"}
            camera-controls
            shadow-intensity="1"
            {...(isInteriorModel ? { "camera-orbit": "0deg 75deg 0m" } : {})}
            {...(isInteriorModel ? { "min-camera-orbit": "auto auto 0m" } : {})}
            ar
            ar-modes="scene-viewer webxr quick-look"
            style={{ width: "100%", height: "100%" }}
            ios-src={usdzUrl}
          >
            <button
              slot="ar-button"
              id="ar-button"
              style={{
                position: "absolute",
                top: "2rem",
                borderRadius: "18px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "inline-flex",
                alignItems: "center",
                minWidth: "180px",
                whiteSpace: "nowrap",
              }}
            >
              <a
                id="default-ar-button"
                part="default-ar-button"
                className="fab"
                tabIndex="2"
                aria-label="View in your space"
                style={{ transform: "scale(0.8)" }}
              >
                {/* Acá va tu SVG */}
              </a>
              <p
                style={{
                  marginBottom: "0px",
                  marginLeft: "0.3rem",
                  marginRight: "0.3rem",
                  color: "black",
                }}
              >
                View in your space
              </p>
            </button>
          </model-viewer>
        </div>
      </div>
    </>
  );
}

export default ARView;
