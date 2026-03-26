import axios from 'axios';

type ZohoTokenResponse = {
  access_token?: string;
  output?: string;
  details?: {
    output?: string;
  };
};

type ZohoRequestConfig = {
  method: string;
  url: string;
  headers: {
    Authorization: string;
    'Content-Type': string;
  };
  params?: Record<string, string | number | boolean>;
  data?: unknown;
};

type ZohoListResponse<T> = {
  data?: T[];
};

class ZohoCRMClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private tokenCacheDuration: number = 50 * 60 * 1000; // 50 minutes

  constructor() {
    const datacenter = process.env.ZOHO_DATACENTER || 'com.au';
    this.baseURL = `https://www.zohoapis.${datacenter}/crm/v7`;

    console.log(`🌍 Zoho CRM configured: ${this.baseURL} (datacenter: ${datacenter})`);
  }

  async getAccessToken(forceRefresh: boolean = false): Promise<string | null> {
    try {
      if (!forceRefresh && this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        console.log('🔑 Using cached Zoho access token');
        return this.accessToken;
      }

      const tokenUrl = process.env.ZOHO_ACCESS_TOKEN_URL || process.env.ACCESSTOKEN_URL;
      if (!tokenUrl) {
        console.warn('⚠️ ZOHO_ACCESS_TOKEN_URL not set - Zoho CRM features will be disabled');
        return null;
      }

      console.log('🔑 Fetching fresh Zoho access token');
      const response = await axios.get<ZohoTokenResponse | string>(tokenUrl, {
        timeout: 30000,
        validateStatus: (status: number) => status < 500,
      });

      let token: string | null = null;

      if (typeof response.data !== 'string' && response.data.access_token) {
        token = response.data.access_token;
      } else if (typeof response.data !== 'string' && response.data.details?.output) {
        token = response.data.details.output;
      } else if (typeof response.data !== 'string' && response.data.output) {
        token = response.data.output;
      } else if (typeof response.data === 'string') {
        token = response.data;
      }

      if (token && typeof token === 'string') {
        token = token.replace(/^Zoho-oauthtoken\s+/, '');
      }

      if (!token) {
        throw new Error('Access token not found in response');
      }

      this.accessToken = token;
      this.tokenExpiry = Date.now() + this.tokenCacheDuration;
      console.log('✅ Zoho access token cached until:', new Date(this.tokenExpiry).toISOString());

      return this.accessToken;
    } catch (error: unknown) {
      console.error(
        '⚠️ Failed to get Zoho access token:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return null;
    }
  }

  async makeRequest<T>(
    method: string,
    endpoint: string,
    data: unknown = null,
    params: Record<string, string | number | boolean> | null = null,
    retryCount: number = 0
  ): Promise<T> {
    const token = await this.getAccessToken();

    if (!token) {
      console.warn('⚠️ No Zoho access token available - skipping API request');
      return { data: [] } as T;
    }

    const config: ZohoRequestConfig = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (params) config.params = params;
    if (data && (method === 'post' || method === 'put')) config.data = data;

    try {
      const response = await axios<T>(config);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401 && retryCount === 0) {
        console.log('⚠️ Got 401 from Zoho, refreshing token and retrying...');
        const freshToken = await this.getAccessToken(true);
        if (freshToken) {
          config.headers.Authorization = `Zoho-oauthtoken ${freshToken}`;
          try {
            const retryResponse = await axios<T>(config);
            return retryResponse.data;
          } catch (retryError: unknown) {
            throw retryError;
          }
        }
      }
      throw error;
    }
  }

  async getRecord(moduleName: string, recordId: string) {
    try {
      const response = await this.makeRequest<ZohoListResponse<Record<string, unknown>>>(
        'get',
        `/${moduleName}/${recordId}`
      );
      return response.data?.[0] || null;
    } catch (error: unknown) {
      console.error(
        `Error fetching ${moduleName} record ${recordId}:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      return null;
    }
  }

  async getRecords(moduleName: string, params: Record<string, string | number | boolean> = {}) {
    try {
      const response = await this.makeRequest<ZohoListResponse<Record<string, unknown>>>(
        'get',
        `/${moduleName}`,
        null,
        params
      );
      return response.data ?? [];
    } catch (error: unknown) {
      console.error(
        `Error fetching ${moduleName} records:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      return [];
    }
  }

  async createRecord(moduleName: string, payload: unknown) {
    try {
      const response = await this.makeRequest<{
        data: Array<{
          code: string;
          details: { id: string };
          message: string;
          status: string;
        }>;
      }>('post', `/${moduleName}`, { data: [payload] });
      return response.data?.[0] || null;
    } catch (error: unknown) {
      console.error(
        `Error creating ${moduleName} record:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  async createRecords(moduleName: string, payloads: unknown[]) {
    try {
      const response = await this.makeRequest<{
        data: Array<{
          code: string;
          details: { id: string };
          message: string;
          status: string;
        }>;
      }>('post', `/${moduleName}`, { data: payloads });
      return response.data ?? [];
    } catch (error: unknown) {
      console.error(
        `Error creating ${moduleName} records:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  async searchRecords(moduleName: string, criteria: string) {
    try {
      const response = await this.makeRequest<ZohoListResponse<Record<string, unknown>>>(
        'get',
        `/${moduleName}/search`,
        null,
        { criteria }
      );
      return response.data ?? [];
    } catch (error: unknown) {
      console.error(
        `Error searching ${moduleName} records:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      return [];
    }
  }

  async updateRecord(moduleName: string, recordId: string, payload: unknown) {
    try {
      const response = await this.makeRequest<{
        data: Array<{
          code: string;
          details: { id: string };
          message: string;
          status: string;
        }>;
      }>('put', `/${moduleName}`, { data: [{ ...(payload as any), id: recordId }] });
      return response.data?.[0] || null;
    } catch (error: unknown) {
      console.error(
        `Error updating ${moduleName} record ${recordId}:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Send mail using the v8 Send Mail API:
   * POST /crm/v8/{module}/{id}/actions/send_mail
   */
  async sendMail(moduleName: string, recordId: string, payload: unknown) {
    const token = await this.getAccessToken();
    if (!token) throw new Error("No Zoho access token available");

    // Construct the v8 URL
    const datacenter = process.env.ZOHO_DATACENTER || 'com.au';
    const v8BaseURL = `https://www.zohoapis.${datacenter}/crm/v8`;
    const url = `${v8BaseURL}/${moduleName}/${recordId}/actions/send_mail`;

    console.log(`📧 Calling Zoho v8 Send Mail: ${url}`);

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
         console.error("❌ Zoho Send Mail Error:", JSON.stringify(error.response?.data, null, 2));
      } else {
         console.error("❌ Email Send Error:", error);
      }
      throw error;
    }
  }

  async uploadAttachment(moduleName: string, id: string, fileContent: Buffer, fileName: string) {
    const token = await this.getAccessToken();
    if (!token) throw new Error("No Zoho access token available");

    const datacenter = process.env.ZOHO_DATACENTER || 'com.au';
    const url = `https://www.zohoapis.${datacenter}/crm/v7/${moduleName}/${id}/Attachments`;

    // Use native FormData (available in Node 18+)
    const formData = new FormData();
    const blob = new Blob([fileContent]);
    formData.append('file', blob, fileName);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Zoho Attachment Error:`, JSON.stringify(error.response?.data, null, 2));
      }
      throw error;
    }
  }
}

export const zohoClient = new ZohoCRMClient();
