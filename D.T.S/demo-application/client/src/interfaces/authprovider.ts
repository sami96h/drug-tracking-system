export type dispatch = () => user;

export type user = {

  username?: string;
  org?:string
};

export type obj = {
  auth: {
    loggedIn?: boolean;
    user: user | null;
    checkedToken?: boolean;
  };
  dispatch?: any;
};

export type action = {
  [x: string]: any;
  payload?: {
    user?: user;
    loggedIn?: boolean;
  };
  type: 'INITIALISE' | 'LOGIN' | 'LOGOUT';

};
