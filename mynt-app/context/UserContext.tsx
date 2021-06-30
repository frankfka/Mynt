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
  const [userId, setUserId] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    if (userId != null) {
      localStorage.setItem('currentUserId', userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userId == null) {
      const currentUserId = localStorage.getItem('currentUserId');
      setUserId(!!currentUserId ? currentUserId : MockUserIds.frank);
    }
  }, [userId]);

  const switchUser = (newUserId: string) => {
    setUserData(undefined);
    setUserId(newUserId);
  };
  const updateUserData = useCallback(async () => {
    if (!userId) {
      return;
    }

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
  }, [updateUserData, userId]);

  const userContextData: UserContextData = {
    userId: userId || '',
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
