import { Router, Request, Response } from 'express';
import logger from '../utils/logger.utils';
import TenantDetailsRepository from '../repository/tenant_details.repository';
import { ITenantConfig } from '../entity/tenanat_config.entity';
import { ITenantDetails } from '../entity/tenant_details.entity';
import TenantService from '../service/tenant.service';

/**
 * Controller for handling tenant-related API requests.
 */
class TenantController {
  public router: Router;
  private tenantService: TenantService;

  constructor() {
    this.router = Router();
    this.tenantService = new TenantService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/tenants', this.createTenant.bind(this));
    this.router.put('/tenants/:tenantId', this.updateTenant.bind(this));
    this.router.post('/tenants/config', this.createTenantConfig.bind(this));
    this.router.put('/tenants/:tenantId/config', this.updateTenantConfig.bind(this));
  }

  private async createTenant(req: Request, res: Response): Promise<void> {
    const tenantData: Partial<ITenantDetails> = req.body;
    logger.info(`Received request to create tenant: ${tenantData.name}`);

    try {
      const response = await this.tenantService.createTenant(tenantData);
      res.status(201).json(response);
    } catch (error: any) {
      logger.error(`Error creating tenant: ${tenantData.name}`, { error });
      if (error.message.includes('already exists')) {
        res.status(409).json({ message: 'A tenant with this email or tenant_id already exists.', error: error.message });
      } else {
        res.status(500).json({ message: 'Error creating tenant', error: error.message });
      }
    }
  }

  private async updateTenant(req: Request, res: Response): Promise<void> {
    const { tenantId } = req.params;
    const updateData: Partial<ITenantDetails> = req.body;
    logger.info(`Received request to update tenant ID: ${tenantId}`);

    try {
      const updatedTenant = await this.tenantService.updateTenant(tenantId, updateData);
      if (!updatedTenant) {
        res.status(404).json({ message: `Tenant with ID ${tenantId} not found.` });
        return;
      }
      res.status(200).json(updatedTenant);
    } catch (error: any) {
      logger.error(`Error updating tenant ID: ${tenantId}`, { error });
      res.status(500).json({ message: 'Error updating tenant', error: error.message });
    }
  }

  private async createTenantConfig(req: Request, res: Response): Promise<void> {
    const configData: Partial<ITenantConfig> = req.body;
    logger.info(`Received request to create tenant config for: ${configData.tenant_id}`);

    try {
      const newConfig = await this.tenantService.createTenantConfig(configData);
      res.status(201).json(newConfig);
    } catch (error: any) {
      logger.error(`Error creating tenant config for: ${configData.tenant_id}`, { error });
      if (error.message.includes('already exists')) {
        res.status(409).json({ message: error.message });
      } else if (error.message.includes('Missing required field')) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error creating tenant config', error: error.message });
      }
    }
  }

  private async updateTenantConfig(req: Request, res: Response): Promise<void> {
    const { tenantId } = req.params;
    const updateData: Partial<ITenantConfig> = req.body;
    logger.info(`Received request to update tenant config for ID: ${tenantId}`);

    try {
      const updatedConfig = await this.tenantService.updateTenantConfig(tenantId, updateData);
      if (!updatedConfig) {
        res.status(404).json({ message: `Tenant config with ID ${tenantId} not found.` });
        return;
      }
      res.status(200).json(updatedConfig);
    } catch (error: any) {
      logger.error(`Error updating tenant config for ID: ${tenantId}`, { error });
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error updating tenant config', error: error.message });
      }
    }
  }
}

export default new TenantController().router;