import React, { createContext, useCallback, useEffect, useState } from 'react';
import User from '../types/User';

export const MockUserIds = {
  frank: 'c815cb53-5097-42f4-8b27-31b1d7a76614',
  isabella: 'b7a1ce44-408d-4145-be74-7de58a0ee500',
};

type UserContextData = {
  userId: string;
  switchUser(userId: string): void;
  userData?: User;
  updateUserData(): void;
  isUpdating: boolean;
};

export const UserContext = createContext<UserContextData>({
  userId: '',
  updateUserData() {},
  switchUser() {},
  isUpdating: false,
});

export const UserContextProvider: React.FC = ({ children }) => {
  const [userId, setUserId] = useState(MockUserIds.frank);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState<User>();

  const switchUser = (newUserId: string) => setUserId(newUserId);
  const updateUserData = useCallback(async () => {
    setIsUpdating(true);

    try {
      const latestUserDataResponse = await fetch('/api/user/' + userId);

      if (latestUserDataResponse.status !== 200) {
        throw Error(
          'Non-successful response status: ' +
            JSON.stringify(latestUserDataResponse)
        );
      }

      const latestUserData = await latestUserDataResponse.json();

      console.log('Fetched latest user data', latestUserData);

      setUserData(latestUserData as unknown as User);
    } catch (err) {
      console.error('Error fetching user data', err);
    } finally {
      setIsUpdating(false);
    }
  }, [userId, setIsUpdating]);

  // Call update user data on load to greedily load the user
  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  const userContextData: UserContextData = {
    userId,
    switchUser,
    isUpdating,
    userData,
    updateUserData,
  };

  return (
    <UserContext.Provider value={userContextData}>
      {children}
    </UserContext.Provider>
  );
};
