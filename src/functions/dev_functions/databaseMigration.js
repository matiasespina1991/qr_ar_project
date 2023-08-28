import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

export const databaseMigration = async () => {
  

    const db = getFirestore(); // Asegúrate de inicializar tu app de Firebase aquí
    
    const migrateModels = async () => {
      const oldModelsRef = collection(db, "qr_codes");
      const newModelsRef = collection(db, "models");
    
      const oldModelDocsSnapshot = await getDocs(oldModelsRef);
    
      oldModelDocsSnapshot.forEach(async (docSnapshot) => {
        const oldModelDoc = docSnapshot.data();
        const newModelDoc = {
          "_debug_comments": oldModelDoc._debug_comments ?? null,
          "createdAt": oldModelDoc._createdAt ?? "2023-08-00T12:00:00Z",
          "updatedAt": oldModelDoc._createdAt ?? "2023-08-00T12:00:00Z",
          "uploadedBy": null, // Puedes agregar el userId si lo tienes
          "files": {
            "glb": {
              "url": oldModelDoc.glbUrl ?? null,
              "fileSize": null,
            },
            "usdz": {
              "url": oldModelDoc.usdzUrl ?? null,
              "fileSize": null,
            }
          },
          "modelName": oldModelDoc.projectName ?? "Untitled Model",
          "modelPreviewImgUrl": oldModelDoc.modelPreviewImageUrl ?? null,
          "qrUrl": oldModelDoc.qrUrl ?? null,
          "isInteriorModel": oldModelDoc.isInteriorModel ?? false,
          "status": oldModelDoc.status ?? "paused",
          "description": "",
          "tags": [],
          "views": {
              "total": 0,
              "lastViewed": null,
          }
        };
    
        const newModelRef = doc(newModelsRef, docSnapshot.id);
        await setDoc(newModelRef, newModelDoc);
        console.log(`Migrado modelo con id: ${docSnapshot.id}`);
      });
    };
    
    // Ejecutá la función para migrar los modelos
    migrateModels().catch((error) => console.log(`Error: ${error}`));
    
    }