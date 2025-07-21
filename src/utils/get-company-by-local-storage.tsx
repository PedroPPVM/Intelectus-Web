export const getSelectedCompany = () => {
  const company = localStorage.getItem('company');
  if (company) return JSON.parse(company);

  return {};
};
