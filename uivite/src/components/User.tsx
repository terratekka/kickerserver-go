import { createContext } from 'react';

export interface User {
    id : number
}

const UserContext = createContext<User>({id : 0});
export default UserContext;
