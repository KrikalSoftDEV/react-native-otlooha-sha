import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNetworkAwareAPI } from '../utils/apiUtils';
import res from '../../constants/res';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';

export const getkhutbahList = createAsyncThunk(
    'khutbah',
    async (body, { getState, rejectWithValue, extra }) => {
        try {
            const { setConnectivity } = extra || {};
            const api = createNetworkAwareAPI(setConnectivity);

            const token = getState().app.globalToken;

            const response = await api.post(
                `${BASE_URL}${ENDPOINTS.KHUTBAH_LIST}`,
                body, // <- This is correct
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            //   console.log('res =============', response);
            return response.data;
        } catch (err) {
            //   console.log('err =============', err);
            if (err.isNetworkError) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue(
                err.response?.data || { message: 'Something went wrong' }
            );
        }
    }
);

const khutbahSlice = createSlice({
    name: 'khutbah',
    initialState: {
        loading: false,
        khutbahData: null,
        error: null
    },
    reducers: {
        resetLoginState: state => {
            state.loading = false;
            state.khutbahListData = null;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getkhutbahList.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getkhutbahList.fulfilled, (state, action) => {
                state.loading = false;
                console.log("fulfilled:action.payload getkhutbahList", action.payload.data.result)
                state.khutbahData = action.payload.data.result
            })
            .addCase(getkhutbahList.rejected, (state, action) => {
                state.loading = false;
                console.log("rejected: action.payload getkhutbahList", action)
                state.error = action.payload?.message || 'Login failed';
            })
    },
});

export default khutbahSlice.reducer;
