import {useEffect, useState} from 'react';
import {UserModel} from '../user/UserModel';
import userStore from '../user/UserStore';
import {Device, Variable} from './DeviceModels';

export const useDeviceInfo = () => {
  const [devices, setDevices] = useState<Array<Device>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserModel>();

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        userStore
          .getUser()
          .then((user) => {
            setCurrentUser(user);
            getDevices(user);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    function getDevices(user: UserModel) {
      fetch(
        `https://api.particle.io/v1/devices?access_token=${user.accessToken}`,
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
          const deviceResults: Device[] = json.map((device: any) => {
            let mappedDevice: Device = device as Device;
            let reformattedVariables: Variable[] = [];
            for (var key in mappedDevice.variables) {
              reformattedVariables.push({
                name: key,
                type: mappedDevice.variables[key],
              });
            }
            mappedDevice.reformattedVariables = reformattedVariables;
            return mappedDevice;
          });
          setDevices(deviceResults);
        })
        .catch(({error}: any) => {
          console.error(error);
        });
    }

    fetchData();
  }, []);

  return [{devices, isError, currentUser}];
};
