import csvParser from 'csv-parser';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const upLoadZipData = async () => {
  const statesDir = '../states';
  const files = await fs.promises.readdir(statesDir);

  // Process the first file as an example (you can modify this to loop through all files)
  const file = files[0];
  const filePath = path.join(statesDir, file); // Make sure to define filePath here

  console.log(`Processing file: ${file}`);

  const zipCodeData = [];

  // Parse CSV file using csv-parser
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        zipCodeData.push(row); // Collect each row as an object
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Parsed ${zipCodeData.length} rows from CSV file ${file}`);

  let batch = writeBatch(db);
  let batchCount = 0;
  const batchSize = 200; // Reduce the batch size to 200 to avoid hitting Firestore limits

  // Iterate over each zip code data row
  for (const feature of zipCodeData) {
    const zipCode = feature.zip; // Assuming 'zip' column in the CSV file
    const coordinates = JSON.stringify([parseFloat(feature.lat), parseFloat(feature.lng)]);

    const docRef = doc(collection(db, 'zipdata'), zipCode); // Upload data to the 'zipdata' collection
    batch.set(docRef, {
      zipCode,
      city: feature.city,
      stateId: feature.state_id,
      stateName: feature.state_name,
      population: feature.population,
      density: feature.density,
      coordinates,
      timezone: feature.timezone,
    });

    batchCount++;

    if (batchCount === batchSize) {
      await batch.commit();
      console.log(`Committed batch of ${batchSize} for file ${file}`);
      batch = writeBatch(db);
      batchCount = 0;

      // Add a delay between batches to prevent exceeding Firestore limits
      await delay(1000); // 1-second delay
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`Committed final batch for file ${file}`);
  }

  console.log(`Uploaded zip data from ${file}`);
};

upLoadZipData().catch(console.error);
