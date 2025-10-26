import mongoose, { Document, Schema } from 'mongoose';

export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'archived';

export type TenantTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface ITenantDetails extends Document {
  status: TenantStatus;
  name: string;
  tenant_id: string;
  tier: TenantTier;
  address: string;
  phone: string;
  email: string;
}

const TenantDetailsSchema: Schema = new Schema(
    {
        status: {type: String, enum: ['active', 'inactive', 'suspended', 'archived'], required: true, default: 'active'},
        name: {type: String, required: true, trim: true},
        tenant_id: {type: String, required: true, unique: true, trim: true},
        tier: {type: String, enum: ['free', 'basic', 'pro', 'enterprise'], required: true, default: 'free'},
        address: {type: String, required: true, trim: true},
        phone: {type: String, required: true, trim: true},
        email: {type: String, required: true, unique: true, trim: true, lowercase: true, match: [/.+@.+\..+/, 'Please fill a valid email address']}, 
    },
    { 
        timestamps: true 
    });

const TenantDetailsModel = mongoose.model<ITenantDetails>('TenantDetails', TenantDetailsSchema);

export default TenantDetailsModel;