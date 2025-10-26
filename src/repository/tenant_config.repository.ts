import { ClientSession, Model } from 'mongoose';
import TenantConfigModel, { ITenantConfig } from '../entity/tenanat_config.entity';

class TenantConfigRepository {
  private tenantConfigModel: Model<ITenantConfig>;

  constructor() {
    this.tenantConfigModel = TenantConfigModel;
  }

  public async createConfig(config: ITenantConfig, session?: ClientSession): Promise<ITenantConfig> {
    const [newConfig] = await this.tenantConfigModel.create([config], { session });
    return newConfig;
  }
 
  public async findConfigByTenantId(tenantId: string): Promise<ITenantConfig | null> {
    return await this.tenantConfigModel.findOne({ tenant_id: tenantId }).exec();
  }

  public async updateConfig(tenantId: string, update: Partial<ITenantConfig>, session?: ClientSession): Promise<ITenantConfig | null> {
    return await this.tenantConfigModel.findOneAndUpdate({ tenant_id: tenantId }, update, { new: true, session }).exec();
  }

  public async deleteConfig(tenantId: string, session?: ClientSession): Promise<ITenantConfig | null> {
    return await this.tenantConfigModel.findOneAndDelete({ tenant_id: tenantId }, { session }).exec();
  }
}

export default TenantConfigRepository;