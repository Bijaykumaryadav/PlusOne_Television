import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicClient } from '@/services/axiosInstance';

// Async thunks for fetching articles
export const fetchAllArticles = createAsyncThunk(
  'articles/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit = 1000, page = 1, category = '' } = params;
      let url = `/articles?limit=${limit}&page=${page}`;
      if (category) {
        url += `&category=${category}`;
      }
      const response = await publicClient.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedArticles = createAsyncThunk(
  'articles/fetchFeatured',
  async (limit = 3, { rejectWithValue }) => {
    try {
      const response = await publicClient.get(`/articles/featured?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoizedArticles = createAsyncThunk(
  'articles/fetchCategorized',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { category, limit = 12, page = 1 } = params;
      let url = `/articles?limit=${limit}&page=${page}`;
      if (category) {
        url += `&category=${category}`;
      }
      const response = await publicClient.get(url);
      return {
        data: response.data.data,
        pagination: response.data.pagination,
        category,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  allArticles: [],
  featuredArticles: [],
  categorizedArticles: [],
  currentCategory: '',
  currentPage: 1,
  totalPages: 1,
  loadingAll: false,
  loadingFeatured: false,
  loadingCategorized: false,
  error: null,
  lastFetchTime: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all articles
    builder
      .addCase(fetchAllArticles.pending, (state) => {
        state.loadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.allArticles = action.payload;
        state.lastFetchTime = new Date().getTime();
      })
      .addCase(fetchAllArticles.rejected, (state, action) => {
        state.loadingAll = false;
        state.error = action.payload;
      });

    // Fetch featured articles
    builder
      .addCase(fetchFeaturedArticles.pending, (state) => {
        state.loadingFeatured = true;
        state.error = null;
      })
      .addCase(fetchFeaturedArticles.fulfilled, (state, action) => {
        state.loadingFeatured = false;
        state.featuredArticles = action.payload;
      })
      .addCase(fetchFeaturedArticles.rejected, (state, action) => {
        state.loadingFeatured = false;
        state.error = action.payload;
      });

    // Fetch categorized articles
    builder
      .addCase(fetchCategoizedArticles.pending, (state) => {
        state.loadingCategorized = true;
        state.error = null;
      })
      .addCase(fetchCategoizedArticles.fulfilled, (state, action) => {
        state.loadingCategorized = false;
        state.categorizedArticles = action.payload.data;
        state.currentCategory = action.payload.category;
        state.totalPages = action.payload.pagination?.pages || 1;
      })
      .addCase(fetchCategoizedArticles.rejected, (state, action) => {
        state.loadingCategorized = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentCategory, setCurrentPage, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
