
export enum DomainStatus {
  Healthy = 'healthy',
  Down = 'down',
  Flagged = 'flagged',
  Checking = 'checking',
}

export interface Domain {
  id: number;
  url: string;
  status: DomainStatus;
  last_checked: string;
  notes: string;
}

export interface RedirectLog {
  id: number;
  original_request: string;
  redirected_domain: string | null;
  ip: string;
  user_agent: string;
  timestamp: string;
}

export interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
}

export interface StatsData {
  uptimePercentage: number;
  totalRedirects: number;
  healthyDomains: number;
  downDomains: number;
  flaggedDomains: number;
  trafficByDomain: { name: string; redirects: number }[];
}
