import {useEffect, useState} from 'react';
import {UserModel} from '../user/UserModel';
import userStore from '../user/UserStore';
import {Device, DeviceInfo, Variable} from './DeviceModels';

export const useDeviceInfo = () => {
  const [devices, setDevices] = useState<Array<Device>>([]);
  const [deviceInfo, setDeviceInfo] = useState<Array<DeviceInfo>>([]);
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
      setDeviceInfo([]);
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
          console.info('DevicesStatusCode: ' + response.status);
          return response.json();
        })
        .then((json) => {
          const deviceResults = json.map((device: any) => {
            let mappedDevice: Device = device as Device;
            getDeviceInformation(user, mappedDevice.id);
            return mappedDevice;
          });
          setDevices(deviceResults);
        })
        .catch(({error}: any) => {
          console.error(error);
        });
    }

    function getDeviceInformation(user: UserModel, deviceId: String) {
      fetch(
        `https://api.particle.io/v1/devices/${deviceId}?access_token=${user.accessToken}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      )
        .then((response) => {
          console.info('DevicesInfoStatusCode: ' + response.status);
          return response.json();
        })
        .then((json) => {
          let newDeviceInfo = json as DeviceInfo;
          let reformattedVariables: Variable[] = [];
          for (var key in newDeviceInfo.variables) {
            reformattedVariables.push({
              name: key,
              type: newDeviceInfo.variables[key],
            });
          }
          newDeviceInfo.reformattedVariables = reformattedVariables;
          setDeviceInfo((previous) => previous.concat(newDeviceInfo));
        });
    }

    fetchData();
  }, []);

  return [{devices, deviceInfo, isError, currentUser}];
};
