import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNetworkAwareAPI } from '../utils/apiUtils';
import res from '../../constants/res';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';

export const getPaymentCardList = createAsyncThunk(
    'getPaymentCardList',
    async (body, { getState, rejectWithValue, extra }) => {
        try {
            const { setConnectivity } = extra || {};
            const api = createNetworkAwareAPI(setConnectivity);

            const token = getState().app.globalToken;
            console.log(`here is the token ------${token}`);
            const response = await api.get(
                `${BASE_URL}${ENDPOINTS.CARD_LIST}`,
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

              console.log('res ============= get ', response);
            return response.data;
        } catch (err) {
              console.log('err ============= get', JSON.stringify(err));
            if (err.isNetworkError) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue(
                err.response?.data || { message: 'Something went wrong' }
            );
        }
    }
);

export const addPaymentCard = createAsyncThunk(
    'paymentCard',
    async (body, { getState, rejectWithValue, extra }) => {
        console.log("addPaymentCardAPI called ");
        try {
            const { setConnectivity } = extra || {};
            const api = createNetworkAwareAPI(setConnectivity);

            const token = getState().app.globalToken;

            const response = await api.post(
                `${BASE_URL}${ENDPOINTS.ADD_CARD}`,
                body,
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

              console.log('res =============', response);
            return response.data;
        } catch (err) {
              console.log('err =============', err);
            if (err.isNetworkError) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue(
                err.response?.data || { message: 'Something went wrong' }
            );
        }
    }
);

const paymentCardSlice = createSlice({
    name: 'paymentCard',
    initialState: {
        loading: false,
        cardData: null,
        error: null
    },
    reducers: {
        resetLoginState: state => {
            state.loading = false;
            state.cardData = null;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
               .addCase(addPaymentCard.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPaymentCard.fulfilled, (state, action) => {
                state.loading = false;
                console.log("fulfilled:action.payload addPaymentCard", action.payload.data)
                // state.cardData = action.payload.data.result
            })
            .addCase(addPaymentCard.rejected, (state, action) => {
                state.loading = false;
                console.log("rejected: action.payload addPaymentCard", action)
                state.error = action.payload?.message || 'addPaymentCard failed';
            })


            .addCase(getPaymentCardList.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentCardList.fulfilled, (state, action) => {
                state.loading = false;
                console.log("fulfilled:action.payload getPaymentCardList", action.payload.data.result)
                // state.cardData = action.payload.data.result
            })
            .addCase(getPaymentCardList.rejected, (state, action) => {
                state.loading = false;
                console.log("rejected: action.payload getPaymentCardList", action)
                state.error = action.payload?.message || 'getPaymentCardList failed';
            })
    },
});

export default paymentCardSlice.reducer;
