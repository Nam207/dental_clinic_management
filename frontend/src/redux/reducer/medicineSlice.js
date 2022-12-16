import { createSlice } from "@reduxjs/toolkit";

const medicineSlice = createSlice({
  name: "medicines",
  initialState: {
    medicine: [],
    medDetail: {
      name: "",
      imageUrl: "",
      quantity: -1,
      price: -1,
      purchasePrice: -1,
      effect: "",
      usage: "",
      contraindication: "",
    },
  },
  reducers: {
    addMedicine: (state, action) => {
      state.medicine.push(action.payload);
    },
    deleteMedicine: (state, action) => {
      state.medicine = state.medicine.filter(
        (med) => med.medId !== action.payload.medId
      );
    },
    getMedicineSuccess: (state, action) => {
      state.medicine = action.payload;
    },
    getMedDetailSuccess: (state, action) => {
      return {...state, medDetail: { ...state.medDetail, ...action.payload }}
    },
    updateMedicine: (state, action) => {
      // state.medicine.map((med) => {
      //   if (med._id === action.payload._id) {
      //     med.name = action.payload.name;
      //     med.imageUrl = action.payload.imageUrl;
      //     med.quantity = action.payload.quantity;
      //     med.price = action.payload.price;
      //     med.purchasePrice = action.payload.purchasePrice;
      //     med.effect = action.payload.effect;
      //     med.usage = action.payload.usage;
      //     med.expiredDay = action.payload.expiredDay;
      //   }
      // });

      if (state.medDetailmedDetail._id === action.payload._id) {
        state.medDetail.name = action.payload.name;
        state.medDetail.imageUrl = action.payload.imageUrl;
        state.medDetail.quantity = action.payload.quantity;
        state.medDetail.price = action.payload.price;
        state.medDetail.purchasePrice = action.payload.purchasePrice;
        state.medDetail.effect = action.payload.effect;
        state.medDetail.usage = action.payload.usage;
        state.medDetail.contraindication = action.payload.contraindication;
      }
    },
  },
});

export const {
  addMedicine,
  deleteMedicine,
  getMedicineSuccess,
  updateMedicine,
  getMedDetailSuccess,
} = medicineSlice.actions;
export default medicineSlice.reducer;
