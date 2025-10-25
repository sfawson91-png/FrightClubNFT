// components/TestConnection.tsx

import React from 'react';
import { useSaveUserData } from '../hooks/useSaveUserData';
import { useSaveBlobData } from '../hooks/useSaveBlobData';

const TestConnection: React.FC = () => {
  // Get the functions from your hooks
  const { saveUserDataToDB } = useSaveUserData();
  const { saveBlobData } = useSaveBlobData();

  const checkConnection = async () => {
    const mockData = {
      userID: '12345',
      address: '0x1234567890abcdef',
      ipAddress: '192.168.1.2',
    };
    
    try {
      // Test saving data to the database
      await saveUserDataToDB(mockData);
      console.log('Data saved to the database successfully.');

      // Test saving data as a blob
      await saveBlobData(mockData);
      console.log('Blob created successfully.');
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={checkConnection}>
      Test Connection
    </button>
  );
};

export default TestConnection;
