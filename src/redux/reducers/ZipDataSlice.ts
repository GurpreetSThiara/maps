import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    zipdata:[],
    zipCodes:[]
}

const zipDataSlice = createSlice({
    name:"zipdata",
    initialState:initialState,
    reducers:{
        setZipData:(state, actions)=>{
            const {zipData} = actions.payload;
        
            if(zipData){
                state.zipdata.push(zipData);
            }
       
        
        },

        setZipCodes : (state , actions) => {
            const {zipcodes} = actions.payload
            console.log("insidestate",zipcodes)
            if(zipcodes){
                state.zipCodes.push(zipcodes);
            }
        },

        reInitZipCodes : (state , actions) => {
            const {zipcodes} = actions.payload
            console.log("insidestate",zipcodes)
            if(zipcodes){
               state.zipCodes = zipcodes
            }
        }


        
    }
})

export const {setZipData , setZipCodes ,reInitZipCodes} = zipDataSlice.actions

export default zipDataSlice