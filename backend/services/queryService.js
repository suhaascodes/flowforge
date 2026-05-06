export function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizePagination(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildSortObject(query = {}, defaultSort = '-createdAt') {
  const sortBy = query.sortBy || defaultSort.replace(/^-/, '');
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  if (query.sortBy) {
    return { [sortBy]: sortOrder };
  }

  if (defaultSort.startsWith('-')) {
    return { [defaultSort.slice(1)]: query.sortOrder === 'asc' ? 1 : -1 };
  }

  return { [defaultSort]: 1 };
}

export function buildSearchFilter(searchTerm, fields = []) {
  if (!searchTerm) {
    return {};
  }

  const pattern = new RegExp(escapeRegex(searchTerm), 'i');

  return {
    $or: fields.map((field) => ({ [field]: pattern })),
  };
}

export function buildPaginationMeta({ page, limit, total }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function paginateArray(items = [], page = 1, limit = 10) {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 1);
  const start = (safePage - 1) * safeLimit;

  return items.slice(start, start + safeLimit);
}

export default {
  escapeRegex,
  normalizePagination,
  buildSortObject,
  buildSearchFilter,
  buildPaginationMeta,
  paginateArray,
};