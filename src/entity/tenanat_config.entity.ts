import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing a TenantConfig document in MongoDB.
 */
export interface ITenantConfig {
  tenant_id: string;
  allowed_product: string[];
  blocked_product: string[];
  remarks?: string;
}

const TenantConfigSchema: Schema = new Schema({
  tenant_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  allowed_product: {
    type: [String],
    default: [],
  },
  blocked_product: {
    type: [String],
    default: [],
  },
  remarks: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const TenantConfigModel = mongoose.model<ITenantConfig>('TenantConfig', TenantConfigSchema);

export default TenantConfigModel;