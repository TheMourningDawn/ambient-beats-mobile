import { useEffect, useState } from 'react';
import { FunctionResult, VariableResult } from './ts/device/DeviceModels';

export const useParticleAPI = (deviceId: string, accessToken: string): [any, CallableFunction, CallableFunction] => {
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

  function variableRequest(variableName: string) {
    return fetch(
      `https://api.particle.io/v1/devices/${deviceId}/${variableName}?access_token=${accessToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const jsonString = JSON.stringify(json, (key, value) => {
          if (typeof value === 'boolean' || typeof value === 'number') {
            return String(value);
          }
          return value;
        });

        const variableResult: VariableResult = JSON.parse(
          jsonString,
        ) as VariableResult;

        return variableResult
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return [{isLoading, isError}, functionRequest, variableRequest];
};
