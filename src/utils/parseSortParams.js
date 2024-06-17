export const parseSortOrder = (sortOrder) => {
  if (['asc', 'desc'].includes(sortOrder)) return sortOrder;
  return 'asc';
};

// const parseSortBy = (sortBy) => {
//   const sortByKeys = ['name'];
//   if(sortByKeys.includes(sortBy)) {
//     return sortBy;
//   } else {
//     return 'name';
//   }
// };
