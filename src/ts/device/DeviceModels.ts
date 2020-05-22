export interface DeviceInfo {
  id: string;
  name: string;
  variables: {[key: number]: string};
  reformattedVariables: Variable[];
  functions: Array<any>;
}

export interface Variable {
  name: string;
  type: string;
}

export interface VariableResult {
  name: string;
  result: string;
  coreInfo: {
    name: string;
    deviceId: string;
    connected: boolean;
  };
}

export interface FunctionResult {
  connected: boolean;
  id: string;
  last_app: string;
  return_value: number;
}

export interface Device {
  cellular: boolean;
  connected: boolean;
  current_build_target: string;
  default_build_target: string;
  id: string;
  last_app: string;
  last_handshake_at: string;
  last_heard: string;
  last_ip_address: string;
  name: string;
  notes: string;
  platform_id: Number;
  product_id: Number;
  serial_number: string;
  status: string;
  system_firmware_version: string;
  deviceInfo: DeviceInfo;
}
