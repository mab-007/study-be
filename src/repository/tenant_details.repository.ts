import { ClientSession, Model } from 'mongoose';
import TenantDetailsModel, { ITenantDetails } from '../entity/tenant_details.entity';

/**
 * Repository for handling database operations for TenantDetails.
 */
class TenantDetailsRepository {
  private model: Model<ITenantDetails>;

  constructor() {
    this.model = TenantDetailsModel;
  }

  public async create(data: ITenantDetails, session?: ClientSession): Promise<ITenantDetails> {
    const [newTenant] = await this.model.create([data], { session });
    return newTenant;
  }

  public async findByTenantId(tenantId: string): Promise<ITenantDetails | null> {
    return await this.model.findOne({ tenant_id: tenantId }).exec();
  }

  public async findByEmail(email: string): Promise<ITenantDetails | null> {
    return await this.model.findOne({ email }).exec();
  }

  public async updateByTenantId(tenantId: string, updateData: Partial<ITenantDetails>, session?: ClientSession): Promise<ITenantDetails | null> {
    return await this.model.findOneAndUpdate({ tenant_id: tenantId }, updateData, { new: true, session }).exec();
  }

  public async deleteByTenantId(tenantId: string, session?: ClientSession): Promise<ITenantDetails | null> {
    return await this.model.findOneAndDelete({ tenant_id: tenantId }, { session }).exec();
  }
}

export default TenantDetailsRepository;