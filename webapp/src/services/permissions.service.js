import { axiosInstance } from './axios.service';

export class PermissionsService {
  constructor() {
    if (!!PermissionsService.instance) {
      return PermissionsService.instance;
    }

    this.URL = '/permissions'
    this.axios = axiosInstance;

    PermissionsService.instance = this;
    return this;
  }

  async list(page, pageSize) {
    const offset = ((page - 1) * pageSize);
    return (await this.axios.get(`${this.URL}?offset=${offset}&limit=${pageSize}`)).data;
  }

  async create(permission) {
    return (await (this.axios.post(this.URL, permission))).data;
  }

  async update(permission) {
    return (await (this.axios.patch(`${this.URL}/${permission.id}`, permission))).data;
  }
}