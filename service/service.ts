import axios from 'axios';

const BASE_URL = 'https://c496b30b-222b-40ae-90d6-06264fb407af-00-3uqjqa04e5ruj.sisko.replit.dev';

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// DAILY COLLECTION

export const createOrUpdateDailyCollection = (payload: {
  name: string;
  month: string;
  amount: number;
}) => api.post('/api/monthly/save', payload);

export const getAllCollections = () => api.get('/api/monthly/all');

export const getAllMemberNames = () => api.get('/api/monthly/names');

export const getTopContributor = () => api.get('/api/monthly/top');

export const getTopContributorThisMonth = () => api.get('/api/monthly/top-this-month');

// EXPENSES

export const createExpense = (payload: {
  date: string;
  name: string;
  amount: number;
  description: string;
  category: string;
  icon: string;
}) => api.post('/api/expenses/create', payload);

export const getAllExpenses = () => api.get('/api/expenses/all');

export const getTotalExpenses = () => api.get('/api/expenses/total');

export const getThisMonthExpenses = () => api.get('/api/expenses/total-current-month');

// SPONSORS

export const createSponsor = (payload: {
  name: string;
  date: string;
  amount: number;
}) => api.post('/api/sponsors/create', payload);

export const getAllSponsors = () => api.get('/api/sponsors/all');

// FINANCIAL SUMMARY

export const getFinancialSummary = () => api.get('/api/finance/summary');

export const getMonthlyFinancialData = () => api.get('/api/finance/monthly-data');

export default {
  createOrUpdateDailyCollection,
  getAllCollections,
  getAllMemberNames,
  getTopContributor,
  getTopContributorThisMonth,
  createExpense,
  getAllExpenses,
  getTotalExpenses,
  getThisMonthExpenses,
  createSponsor,
  getAllSponsors,
  getFinancialSummary,
  getMonthlyFinancialData,
};
