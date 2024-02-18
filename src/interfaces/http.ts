type TServerError = {
  message: string;
  path: string[];
};

interface IServerResponse {
  status: boolean;
  data?: unknown;
  errors?: TServerError[];
}

type THeader = {
  name: string;
  value: string | number;
};

export type { THeader }

export type { IServerResponse }

