import ExamPapersService from '../service/cbse/exampapers.cbse.service';

class TenantFactory {

  public static getFactoryInstance(tenant: string): any {
    switch (tenant.toLowerCase()) {
      case 'cbse':
        return ExamPapersService;
      default:
        throw new Error(`Tenant type '${tenant}' is not supported by the factory.`);
    }
  }
}

export default TenantFactory;
