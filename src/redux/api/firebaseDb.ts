import { collection, getDocs } from "firebase/firestore";
import Pako from "pako";
import { setMapData } from "../reducers/MapDataSlice";
import { db } from "@/lib/config";

// Cache for storing the data and the loading state
const zipCodesCache: Record<string, any> = {};
const loadingCache: Record<string, boolean> = {};

async function decompressCoordinates(compressedString: string) {
  try {
    const compressed = Uint8Array.from(atob(compressedString), (char) => char.charCodeAt(0));
    const decompressed = Pako.inflate(compressed, { to: "string" });
    return JSON.parse(decompressed);
  } catch (error) {
    console.error("Error decompressing coordinates:", error.message);
    throw error;
  }
}

export async function getAllUSZipCodes(province: string, dispatch: any) {
  console.log("get all zip codes");


  if (zipCodesCache[province]) {
    console.log("Returning cached data");
    dispatch(setMapData(zipCodesCache[province]));
    return;
  }


  if (loadingCache[province]) {
    console.log("Request in progress for this province. Skipping new API call.");
    return;
  }


  loadingCache[province] = true;

  try {
    const zipCodesCollection = collection(db, province.toLowerCase());
    const snapshot = await getDocs(zipCodesCollection);

    const zipCodes = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const decompressedCoordinates = await decompressCoordinates(data.compressedCoordinates);
      return {
        id: doc.id,
        ...data,
        coordinates: decompressedCoordinates,
      };
    }));


    const geoJsonData = {
      type: "FeatureCollection",
      features: zipCodes.map((zipCode) => ({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: zipCode.coordinates,
        },
        properties: {
          ...zipCode,
        },
      })),
    };


    zipCodesCache[province] = geoJsonData;

    dispatch(setMapData(geoJsonData));

    console.log(zipCodes);
  } catch (error) {
    console.error("Error fetching US zip codes:", error.message);
  } finally {

    loadingCache[province] = false;
  }
}
