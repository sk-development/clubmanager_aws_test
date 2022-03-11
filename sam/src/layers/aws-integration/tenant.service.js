module.exports = class TenantService {

    _tenantUuid = "d938gi"; // defaults to demo tenant

    constructor() {
        const tenantUuid = process.env.TENANT_UUID;
        if(tenantUuid!=null)
            this._tenantUuid = tenantUuid;
    }

    getTenantUuid() {
        return this._tenantUuid;
    }
   
}