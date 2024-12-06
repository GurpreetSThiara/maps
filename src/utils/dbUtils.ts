import { db } from "@/lib/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import pako from "pako";

const isValidZipCode = (zipCode: string) => /^[0-9]{5}$/.test(zipCode);

export async function decompressCoordinates(compressedString: string) {
  try {
    // Decode Base64 string into a Uint8Array
    const compressed = Uint8Array.from(atob(compressedString), (char) => char.charCodeAt(0));
    // Decompress using pako
    const decompressed = pako.inflate(compressed, { to: "string" });
    return JSON.parse(decompressed);
  } catch (error) {
    console.error("Error decompressing coordinates:", error.message);
    throw error;
  }
}

export async function getZipCodeCoordinates(zipCode: string) {
  try {
    if (!isValidZipCode(zipCode)) {
      throw new Error("Invalid ZIP code format. ZIP code must be a 5-digit number.");
    }

    const docRef = doc(collection(db, "uszipcodes"), zipCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const decompressedCoordinates = await decompressCoordinates(data.compressedCoordinates);
      console.log(decompressedCoordinates)
      return {
        ...data,
        coordinates: decompressedCoordinates,
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching ZIP code coordinates:", error.message);
    throw error;
  }
}

export async function getZipCodeData(zipCode: string) {
    try {
        if (!isValidZipCode(zipCode)) {
          throw new Error("Invalid ZIP code format. ZIP code must be a 5-digit number.");
        }
    
        const docRef = doc(collection(db, "zipdata"), zipCode);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data)
         
         return data
        } else {
          console.log("No such document!");
          return null;
        }
      } catch (error) {
        console.error("Error fetching ZIP code coordinates:", error.message);
        throw error;
      }
}

export async function getAllUSZipCodes(province:string) {
  try {
    const zipCodesCollection = collection(db, province.toLowerCase());
    const snapshot = await getDocs(zipCodesCollection);

    const zipCodes = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const decompressedCoordinates = await decompressCoordinates(data.compressedCoordinates);
    console.log(decompressedCoordinates)
      return {
        id: doc.id,
        ...data,
        coordinates: decompressedCoordinates,
      };
    }));

    return zipCodes;
  } catch (error) {
    console.error("Error fetching US zip codes:", error.message);
    throw error;
  }
}

// Function to get all documents from the 'zipdata' collection
export async function getAllZipData() {
  try {
    const zipDataCollection = collection(db, "zipdata");
    const snapshot = await getDocs(zipDataCollection);

    
    const zipData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return zipData;
  } catch (error) {
    console.error("Error fetching zip data:", error.message);
    throw error;
  }
}
