import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ProposalSlice {
  proposalData: any; // TODO: use type from API
}

export const initialState: ProposalSlice = {
  proposalData: null,
};

interface FetchProposalArgs {
  proposalId: string;
  accessToken: string;
}

export const fetchProposalData = createAsyncThunk(
  "proposal/fetchProposalDataStatus",
  async ({ proposalId, accessToken }: FetchProposalArgs) => {
    // TODO: return proposal object

    return proposalId;
  },
);

export const proposalSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProposalData.fulfilled, (state, action) => {
      state.proposalData = action.payload;
    });
  },
});

export default proposalSlice.reducer;
