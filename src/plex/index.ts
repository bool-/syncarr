import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface PlexOptions {
  device: string; //
  deviceName: string;
  version: string;
  platform: string;
  platformVersion?: string;
  token: string;
  identifier: string;
  product: string;
  provides: string;
  url: string;
}

/*
X-Plex-Token: string
X-Plex-Client-Identifier: string
X-Plex-Product: string
X-Plex-Version: string
X-Plex-Device: string
X-Plex-Device-Name: string
X-Plex-Platform: string
X-Plex-Platform-Version: string
X-Plex-Provides: string
 */
// TODO decide if this can be the same for plex.tv and direct server connections
export function client(params: PlexOptions) {
  return axios.create({
    headers: {
      baseURL: params.url, // TODO generate a uri from the hostname and port if specified
      'X-Plex-Token': params.token,
      'X-Plex-Client-Identifier': params.identifier,
      'X-Plex-Product': params.product,
      'X-Plex-Version': params.version,
      'X-Plex-Device': params.device,
      'X-Plex-Device-Name': params.deviceName,
      'X-Plex-Platform': params.platform,
      'X-Plex-Platform-Version': params.platformVersion,
      'X-Plex-Provides': params.provides,
    },
  });
}

/*
request:
strong: boolean [false: 4-char code, true: 25-char code]

response:
authToken: null
clientIdentifier: string
code: string
createdAt: string
expiresAt: string​
expiresIn: number
id: number
location: {
  city: string
  code: string
  coordinates: string
  country: string
  postal_code: string
  subdivisions: string
  time_zone: string
}
newRegistration: null
product: string
trusted: boolean
 */
export async function pin(instance: AxiosInstance, pin?: number, strong: boolean = true) {
  const result = await instance.post(pin ? `/api/v2/pins/${pin}`: '/api/v2/pins/', {'strong': strong});
  if (result.status === 200) {
    return result.data;
  } else {
    return result.status;
  }
}


/*
request:
includeHttps: boolean
X-Plex-Token: string
X-Plex-Client-Identifier: string

response:
name: string
product: string
productVersion: string
platform: string
platformVersion: string
device: string
clientIdentifier: string
createdAt: string
lastSeenAt: string
provides: string [controller, server, client]
ownerId: null
sourceTitle: null
publicAddress: string,
accessToken: string,
owned: boolean,
home: boolean,
synced: boolean,
relay: boolean,
presence: boolean,
httpsRequired: boolean,
publicAddressMatches: boolean,
dnsRebindingProtection: boolean
natLoopbackSupported: boolean,
connections: [
  {
    protocol: string [https, http]
    address: string
    port: number
    uri: string
    local: boolean
    relay: boolean
    IPv6: boolean
  }
]
 */
export async function resources(instance: AxiosInstance) {
  const result = await instance.get(
    '/api/v2/resources.json?includeHttps=true'
  );
  if (result.status === 200) {
    return result.data;
  } else {
    return result.status;
  }
}