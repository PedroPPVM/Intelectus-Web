import { getCookie } from '@/utils/cookies';

export const getSelectedCompany = () => {
  const company = getCookie('company');
  if (company) return JSON.parse(company);

  return {};
};
