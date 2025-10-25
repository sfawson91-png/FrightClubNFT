// hooks/useSaveUserData.ts

type UserData = {
    userID: string;
    address: string;
    ipAddress: string;
};


export const useSaveUserData = () => {
    const saveUserDataToDB = async (userData: UserData): Promise<void> => {
      try {
        const response = await fetch('/api/postUserData', {
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error('Failed to save user data:', response.statusText);
          return;
        }
        const responseData = await response.json();
        console.log('User data saved:', responseData);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };
    
    return { saveUserDataToDB };
  };