/**
 * System status interface
 */
export interface SystemStatus {
  system: {
    uptime: number;
    memory: {
      total: number;
      free: number;
      usage: number;
    };
    cpu: any[];
    platform: string;
    hostname: string;
    loadAverage: number[];
    timestamp: string;
  };
  features: {
    aiModels: boolean;
    dataAcquisition: boolean;
    knowledgeGraph: boolean;
    metaLearning: boolean;
  };
}

/**
 * Feature card interface
 */
export interface FeatureCard {
  title: string;
  description: string;
  status: boolean;
  icon?: string;
}

/**
 * Feature detail interface
 */
export interface FeatureDetail {
  title: string;
  description: string;
  capabilities: string[];
  benefits: string[];
  useCases: string[];
  icon?: string;
}