import { http } from './http.service';

export const LocationService = {
  getCountries: async () => {
    const res = await http.get('/locations/countries');
    return Array.isArray(res) ? res : res?.data || [];
  },
  getCountry: async (countryCode: string) => {
    const res = await http.get(`/locations/country/${countryCode}`);
    return res?.data || res;
  },
  getStates: async (countryCode: string) => {
    const res = await http.get(`/locations/states?country=${encodeURIComponent(countryCode)}`);
    return Array.isArray(res) ? res : res?.data || [];
  },
  getLgas: async (countryCode: string, stateName: string) => {
    const res = await http.get(
      `/locations/lgas?country=${encodeURIComponent(countryCode)}&state=${encodeURIComponent(stateName)}`,
    );
    return Array.isArray(res) ? res : res?.data || [];
  },
  getCities: async (countryCode: string, stateName: string) => {
    const res = await http.get(
      `/locations/cities?country=${encodeURIComponent(countryCode)}&state=${encodeURIComponent(stateName)}`,
    );
    return Array.isArray(res) ? res : res?.data || [];
  },
};
