interface IBaseCategory {
  name: string
  slug: string
}

interface ICategory extends IBaseCategory {
  id: number;
  parentId: number
}

interface ICategories {
  [key: number]: ICategory;
}

export { IBaseCategory, ICategory, ICategories }
