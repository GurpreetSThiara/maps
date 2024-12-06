import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const firebaseConfig = {
  apiKey: "AIzaSyCme4k1H5g4TiaJUtWeJX3-E8rmncyHEJw",
  authDomain: "maps-c88b7.firebaseapp.com",
  projectId: "maps-c88b7",
  storageBucket: "maps-c88b7.firebasestorage.app",
  messagingSenderId: "401847672411",
  appId: "1:401847672411:web:b215f6692461821a90297e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function compressCoordinates(coordinates) {
  const stringified = JSON.stringify(coordinates);
  const compressed = await gzip(stringified);
  return compressed.toString('base64');
}

async function decompressCoordinates(compressedString) {
  const compressed = Buffer.from(compressedString, 'base64');
  const decompressed = await gunzip(compressed);
  return JSON.parse(decompressed.toString());
}

async function uploadStateZipCodes() {
  try {
    const statesDir = '../states';
    const files = await fs.readdir(statesDir);

    for (const file of files) {
      if (path.extname(file) === '.json') {
        const stateCode = 'boston'
        const filePath = path.join(statesDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const stateZipCodes = JSON.parse(data);

        console.log(`Processing ${stateZipCodes.features.length} zip codes for state ${stateCode}`);

        let batch = writeBatch(db);
        let batchCount = 0;

        for (const feature of stateZipCodes.features) {
          const geo_id = feature.properties.GEO_ID;
          const name = feature.properties.NAME;
          const coordinates = feature.geometry.coordinates;
          const compressedCoordinates = await compressCoordinates(coordinates);

          const docRef = doc(collection(db, 'provinces'), name);
          batch.set(docRef, {
            geo_id,
            name,
            properties: feature.properties,
            geometryType: feature.geometry.type,
            compressedCoordinates
          });

          batchCount++;

          if (batchCount === 100) {
            await batch.commit();
            console.log(`Committed batch of 100 for state ${stateCode}`);
            batch = writeBatch(db);
            batchCount = 0;


            await new Promise(resolve => setTimeout(resolve, 10 * 1000));
          }
        }

        if (batchCount > 0) {
          await batch.commit();
          console.log(`Committed final batch for state ${stateCode}`);
        }

        console.log(`Uploaded zip codes for state ${stateCode}`);
      }
    }

    console.log('Upload completed successfully!');
  } catch (error) {
    console.error('Error uploading zip codes:', error);
  }
}


uploadStateZipCodes()
//uploadStateZipCodes();

const upLoadZipData = async () => {
  const statesDir = '../states';
  const files = await fs.readdir(statesDir);

  // Process the first file as an example (you can modify this to loop through all files)
  const file = files[0];
  const filePath = path.join(statesDir, file); // Make sure to define filePath here
  const data = await fs.readFile(filePath, 'utf8');
  const stateZipCodes = JSON.parse(data);

  console.log(`Processing ${stateZipCodes.features.length} zip codes from the file ${file}`);

  let batch = writeBatch(db);
  let batchCount = 0;

  for (const feature of stateZipCodes.features) {
    const zipCode = feature.zip;
    const coordinates = JSON.stringify([feature.lat , features.lng]);
   

    const docRef = doc(collection(db, 'zipdata'), zipCode); // Upload data to the 'zipdata' collection
    batch.set(docRef, {
      zipCode,
      city: feature.properties.city,
      stateId: feature.properties.state_id,
      stateName: feature.properties.state_name,
   
      population: feature.properties.population,
      density: feature.properties.density,

      coordinates: coordinates,

      timezone: feature.properties.timezone,

    });

    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      console.log(`Committed batch of 500 for state ${feature.properties.state_name}`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`Committed final batch for file ${file}`);
  }

  console.log(`Uploaded zip data from ${file}`);
};

//upLoadZipData().catch(console.error);

// Example of how to retrieve and decompress coordinates
async function getZipCodeCoordinates(zipCode) {
  const docRef = doc(collection(db, 'zipcodes'), zipCode);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const decompressedCoordinates = await decompressCoordinates(data.compressedCoordinates);
    return {
      ...data,
      coordinates: decompressedCoordinates
    };
  } else {
    console.log("No such document!");
    return null;
  }
}

// Uncomment to test retrieval
// getZipCodeCoordinates('12345').then(console.log).catch(console.error);