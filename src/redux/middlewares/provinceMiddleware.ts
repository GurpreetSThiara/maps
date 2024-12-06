// import { Middleware } from '@reduxjs/toolkit';
// import { setProvince, setMapData } from '../reducers/MapDataSlice';
// import Pako from 'pako';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/config';

// export const provinceMiddleware: Middleware = (store) => (next) => (action) => {
//   if (setProvince.match(action)) {
//     console.log('Province changed:', action.payload);

//     const currentState = store.getState();
    
//     console.log('Current zoom level:', currentState.mapData.zoomLevel);
//     console.log('Current map level:', currentState.mapData.level);

//     if (currentState.mapData.zoomLevel.zoomLevel > 7) {
//       getAllUSZipCodes(action.payload, store.dispatch);
//     }else{
//         console.log("firebase not get called")
//     }
//   }
//   return next(action);
// };

// async function decompressCoordinates(compressedString: string) {
//   try {
//     const compressed = Uint8Array.from(atob(compressedString), (char) => char.charCodeAt(0));
//     const decompressed = Pako.inflate(compressed, { to: "string" });
//     return JSON.parse(decompressed);
//   } catch (error) {
//     console.error("Error decompressing coordinates:", error.message);
//     throw error;
//   }
// }

// async function getAllUSZipCodes(province: string, dispatch: any) {
//     console.log("get all zip codes")
//   try {
//     const zipCodesCollection = collection(db, province.toLowerCase());
//     const snapshot = await getDocs(zipCodesCollection);

//     const zipCodes = await Promise.all(snapshot.docs.map(async (doc) => {
//       const data = doc.data();
//       const decompressedCoordinates = await decompressCoordinates(data.compressedCoordinates);
//       console.log(decompressedCoordinates);
//       return {
//         id: doc.id,
//         ...data,
//         coordinates: decompressedCoordinates,
//       };
//     }));

//     // Dispatch the action to update the mapData state
//     dispatch(setMapData(zipCodes));
//   } catch (error) {
//     console.error("Error fetching US zip codes:", error.message);
//     throw error;
//   }
// }

