interface IBasePost {
  title: string;
  content: string;
  published: boolean;
  userId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date
}

interface IPost extends IBasePost {
  id: number;
}

interface IPosts {
  [key: number]: IPost;
}

export { IBasePost, IPost, IPosts }
