import api from './api';

const processRecurringExpenses = async () => {
  try {
    const response = await api.post('/expenses/process-recurring');
    return response.data;
  } catch (error) {
    return { success: false, message: 'Failed to process recurring expenses' };
  }
};

const getRecurringExpenses = async (filters = {}) => {
  try {
    const response = await api.get('/expenses', {
      params: { ...filters, recurring: true }
    });
    return response.data;
  } catch (error) {
    return { success: false, message: 'Failed to fetch recurring expenses' };
  }
};

export default {
  processRecurringExpenses,
  getRecurringExpenses
}; 