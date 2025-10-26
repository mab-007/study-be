import { randomUUID } from 'crypto';
import { ITenantDetails } from '../entity/tenant_details.entity';
import { ITenantConfig } from '../entity/tenanat_config.entity';
import TenantDetailsRepository from '../repository/tenant_details.repository';
import TenantConfigRepository from '../repository/tenant_config.repository';
import logger from '../utils/logger.utils';

class TenantService {
  private tenantDetailsRepository: TenantDetailsRepository;
  private tenantConfigRepository: TenantConfigRepository;

  constructor() {
    this.tenantDetailsRepository = new TenantDetailsRepository();
    this.tenantConfigRepository = new TenantConfigRepository();
  }

  public async createTenant(tenantData: Partial<ITenantDetails>): Promise<ITenantDetails> {
    logger.info(`Attempting to create tenant: ${tenantData.name}`);

    if (!tenantData.name || !tenantData.email || !tenantData.address || !tenantData.phone) {
      throw new Error('Missing required fields: name, email, address, and phone are required.');
    }

    const existingByEmail = await this.tenantDetailsRepository.findByEmail(tenantData.email);
    if (existingByEmail) {
      throw new Error(`A tenant with the email ${tenantData.email} already exists.`);
    }
    
    // Generate the custom tenant_id
    const tenantId = `${tenantData.name.substring(0, 3).toLowerCase()}-${randomUUID().replace(/-/g, '')}`;
    
    const tenantObj : ITenantDetails = {
        status: 'active',
        name: tenantData.name,
        tenant_id: tenantId,
        tier: 'free',
        address: tenantData.address,
        phone: tenantData.phone,
        email: tenantData.email
    };

    return this.tenantDetailsRepository.create(tenantObj);
  }

  public async updateTenant(tenantId: string, updateData: Partial<ITenantDetails>): Promise<ITenantDetails> {
    logger.info(`Attempting to update tenant ID: ${tenantId}`);
    const updatedTenant = await this.tenantDetailsRepository.updateByTenantId(tenantId, updateData);

    if (!updatedTenant) {
      throw new Error(`Tenant with ID ${tenantId} not found.`);
    }

    return updatedTenant;
  }

  public async createTenantConfig(configData: Partial<ITenantConfig>): Promise<ITenantConfig> {
    const { tenant_id } = configData;
    logger.info(`Attempting to create config for tenant ID: ${tenant_id}`);

    if (!tenant_id) {
      throw new Error('Missing required field: tenant_id is required.');
    }

    const existingConfig = await this.tenantConfigRepository.findConfigByTenantId(tenant_id);
    if (existingConfig) {
      throw new Error(`A configuration for tenant ID ${tenant_id} already exists.`);
    }

    const configObj = {
        tenant_id: tenant_id,
        allowed_product: [],
        blocked_product: [],
        remarks: ''
    }

    return this.tenantConfigRepository.createConfig(configObj);
  }
  
  public async updateTenantConfig(tenantId: string, updateData: Partial<ITenantConfig>): Promise<ITenantConfig> {
    logger.info(`Attempting to update config for tenant ID: ${tenantId}`);
    const updatedConfig = await this.tenantConfigRepository.updateConfig(tenantId, updateData);

    if (!updatedConfig) {
      throw new Error(`Configuration for tenant with ID ${tenantId} not found.`);
    }

    return updatedConfig;
  }
}

export default TenantService;