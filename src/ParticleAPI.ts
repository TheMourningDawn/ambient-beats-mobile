import { useEffect, useState } from 'react';
import { FunctionResult } from './ts/device/DeviceModels';
import { UserModel } from 'src/ts/user/UserModel';

export const useParticleAPI = (deviceId: string, accessToken: string): [any, CallableFunction] => {
  const [functionResult, setFunctionResult] = useState<FunctionResult>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
  }, []);

  function functionRequest(
    functionName: string,
    inputValue: string,
  ) {
    var formData = new URLSearchParams();
    formData.append('access_token', accessToken);
    formData.append('args', inputValue);
  
    return fetch(
      `https://api.particle.io/v1/devices/${deviceId}/${functionName}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const functionResponse: FunctionResult = json as FunctionResult;
        return functionResponse;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return [{functionResult, isLoading, isError}, functionRequest];
};
