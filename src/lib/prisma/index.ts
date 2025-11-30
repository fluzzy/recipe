export const recipeSelect = {
  id: true,
  title: true,
  thumbnailUrl: true,
  tags: true,
  viewCount: true,
  Author: {
    select: {
      name: true,
    },
  },
  _count: {
    select: {
      likes: true,
    },
  },
} as const;

export const authorInclude = {
  _count: {
    select: {
      Recipe: true,
    },
  },
} as const;
