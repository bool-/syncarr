import axios, { AxiosInstance, AxiosResponse } from 'axios';
import querystring from 'querystring';

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

export default class PlexAPI {
  private axiosInstance: AxiosInstance;
  private clientIdentifier: string;

  constructor(private _plexOptions: PlexOptions) {
    this.clientIdentifier = _plexOptions.identifier || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.axiosInstance = axios.create({
      baseURL: _plexOptions.url || 'https://plex.tv/',
      headers: {
        // TODO generate a uri from the hostname and port if specified
        'X-Plex-Token': _plexOptions.token || '',
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        'X-Plex-Client-Identifier': this.clientIdentifier,
        'X-Plex-Product': _plexOptions.product || 'Plexarr',
        'X-Plex-Version': _plexOptions.version || '0.0.0',
        'X-Plex-Device': _plexOptions.device || 'NPM',
        'X-Plex-Device-Name': _plexOptions.deviceName || 'JavaScript',
        'X-Plex-Platform': _plexOptions.platform || 'JavaScript',
        'X-Plex-Platform-Version': _plexOptions.platformVersion || '0.0.0',
        'X-Plex-Provides': _plexOptions.provides || '',
      },
    });
  }

  generateQueryString(additionalHeaders?: any): string {
    const headers = {
      // TODO generate a uri from the hostname and port if specified
      'X-Plex-Token': this._plexOptions.token || '',
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        'X-Plex-Client-Identifier': this.clientIdentifier,
        'X-Plex-Product': this._plexOptions.product || 'Plexarr',
        'X-Plex-Version': this._plexOptions.version || '0.0.0',
        'X-Plex-Device': this._plexOptions.device || 'NPM',
        'X-Plex-Device-Name': this._plexOptions.deviceName || 'JavaScript',
        'X-Plex-Platform': this._plexOptions.platform || 'JavaScript',
        'X-Plex-Platform-Version': this._plexOptions.platformVersion || '0.0.0',
        'X-Plex-Provides': this._plexOptions.provides || '',
    };
    const queryString = querystring.stringify({ ...headers, additionalHeaders });
    return '?' + queryString;
  }

  public async pin(pin?: number, strong: boolean = true) : Promise<Pin> {
    let result: AxiosResponse;
    if (pin) {
      result = await this.axiosInstance.get<Pin>(`/api/v2/pins/${pin}` + this.generateQueryString());
    } else {
      result = await this.axiosInstance.post<Pin>('/api/v2/pins/' + this.generateQueryString(), { 'strong': strong });
    }
    return result.data;
  }
  public async resources(): Promise<Resource[]> {
    const result = await this.axiosInstance.get<Resource[]>(
      '/api/v2/resources.json' + this.generateQueryString({ 'includeHttps': true }),
    );
    return result.data;
  }

  public async library(section?: number, key?: string): Promise<Library> {
    let result: AxiosResponse;
    if (key && section) {
      result = await this.axiosInstance.get<Library>(`/library/sections/${section}/${key}` + this.generateQueryString());
    } else if (section) {
      result = await this.axiosInstance.get<Library>(`/library/sections/${section}` + this.generateQueryString());
    } else {
      result = await this.axiosInstance.get<Library>('/library/sections' + this.generateQueryString());
    }
    return result.data;
  }
}

export type Pin = {
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

export type Resource = {
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
export type Connection = {
  protocol: string;
  address: string;
  port: number;
  uri: string;
  local: boolean;
  relay: boolean;
  IPv6: boolean;
}

export type Library = {
  MediaContainer: MediaContainer;
}
export type MediaContainer = MediaContainerBase & MediaContainerSection;
export type MediaContainerBase = {
  Directory: Directory;
  allowSync: boolean;
  identfier: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  size: number;
  title1: string;
}
export type MediaContainerSection = {
  Metadata: Metadata[];
  art: string;
  content: string;
  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;
  thumb: string;
  title2: string;
  viewGroup: string;
  viewMode: number;
}
export type Metadata = MetadataBase
export type MetadataBase = {

}
export type Directory = DirectoryBase;
export type DirectoryBase = {
  key: string;
  title: string;
}