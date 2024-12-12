import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { US_DENSITY_DATA_MERGED_COORDINATES } from "../data";


const initialState = {
    bounds: null,
    zoomLevel: null,
    level: 'province',
    data: US_DENSITY_DATA_MERGED_COORDINATES,
    province:null
};

const mapDataSlice = createSlice({
    name: "mapData",
    initialState,
    reducers: {

            setProvince: (state, action) => {
                console.log("provinnnnnnnnnnnnnnceeeeeeeeeeeeeeeeeeeee", action.payload);
                state.province = action.payload
            },
        setMapBounds: (state, action) => {
            const { payload: bounds } = action;
            console.log("Setting border coordinates:", bounds);
            state.bounds = bounds;
        },
        setMapZoomLevel: (state, action) => {
            const { payload: zoomLevel } = action;
            console.log("Setting zoom level:", zoomLevel);
            state.zoomLevel = zoomLevel;
        },
        setMapLevel: (state, action: PayloadAction<'province' | 'city' | 'zip'>) => {
            const { payload: level } = action;
            console.log("Setting map level:", level);
            state.level = level;
            if(level === 'city' || level === 'province'){
                state.data = US_DENSITY_DATA_MERGED_COORDINATES
            }
        },
        setMapData: (state, action) => {
            const { payload: data } = action;
            console.log("Setting map data:", data);
           
    // Check if the incoming data is the same as the current state data
    if (JSON.stringify(data) !== JSON.stringify(state.data)) {
        console.log("not equal dattatadtasdasjfgjhsd f,nbjkfdnb")
        state.data = data; // Only update if the data is different
    }
        },

        addMapData:(state,action) => {
            const { payload: data } = action;
            if(state.data){
                
                state.data.features.push(data);
            }
        }
    },
});

export const { setMapBounds, setMapZoomLevel, setMapLevel, setMapData,setProvince,addMapData } = mapDataSlice.actions;

export default mapDataSlice;