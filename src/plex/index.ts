import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface PlexOptions {
  device?: string; //
  deviceName?: string;
  version?: string;
  platform?: string;
  platformVersion?: string;
  token?: string;
  identifier?: string;
  product?: string;
  provides?: string;
  url?: string;
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
    baseURL: params.url || 'https://plex.tv/',
    headers: {
      // TODO generate a uri from the hostname and port if specified
      'X-Plex-Token': params.token || '',
      // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
      'X-Plex-Client-Identifier': params.identifier || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      'X-Plex-Product': params.product || 'Plexarr',
      'X-Plex-Version': params.version || '0.0.0',
      'X-Plex-Device': params.device || 'NPM',
      'X-Plex-Device-Name': params.deviceName || 'JavaScript',
      'X-Plex-Platform': params.platform || 'JavaScript',
      'X-Plex-Platform-Version': params.platformVersion || '0.0.0',
      'X-Plex-Provides': params.provides || '',
    },
  });
}

export interface Pin {
  authToken: string;
  clientIdentifier: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  expiresIn: number;
  id: number;
  location: {
    city: string;
    code: string;
    coordinates: string;
    country: string;
    postal_code: string;
    subdivisions: string;
    time_zone: string;
  }
  newRegistration: string;
  product: string;
  trusted: boolean;
}
export async function pin(instance: AxiosInstance, pin?: number, strong: boolean = true) : Promise<Pin> {
  let result: AxiosResponse;
  if (pin) {
    result = await instance.get(`/api/v2/pins/${pin}`);
  } else {
    result = await instance.post('/api/v2/pins/', { 'strong': strong });
  }
  return result.data;
}

export interface Resource {
  name: string;
  product: string;
  productVersion: string;
  platform: string;
  platformVersion: string;
  device: string;
  clientIdentifier: string;
  createdAt: string;
  lastSeenAt: string;
  provides: string;
  ownerId: null;
  sourceTitle: null;
  publicAddress: string;
  accessToken: string;
  owned: boolean;
  home: boolean;
  synced: boolean;
  relay: boolean;
  presence: boolean;
  httpsRequired: boolean;
  publicAddressMatches: boolean;
  dnsRebindingProtection: boolean;
  natLoopbackSupported: boolean;
  connections: Connection[];
}
export interface Connection {
  protocol: string;
  address: string;
  port: number;
  uri: string;
  local: boolean;
  relay: boolean;
  IPv6: boolean;
}
export async function resources(instance: AxiosInstance): Promise<Resource[]> {
  const result = await instance.get(
    '/api/v2/resources.json?includeHttps=true',
  );
  return result.data;
}