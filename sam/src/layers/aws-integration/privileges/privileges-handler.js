'use strict';

const TenantService = require("../tenant.service");
const RequiredPrivileges = require("./required-privileges");

module.exports = class PrivilegesHandler {
    _tenantService = null;

    constructor() {
        this._tenantService = new TenantService();
    }

    moduleTemplates = [];

    registerModulePrivilege(moduleName, privilege) {
        this.moduleTemplates.push({
            moduleName, privilege
        })
    }

    require() {
        const requiredPrivileges = new RequiredPrivileges();

        const propertyName = "tenantAdmin";
        requiredPrivileges[propertyName] = () => {
            const privilegeEntry = requiredPrivileges.addTenantPrivilege(this._tenantService.getTenantUuid(), "admin");
            this._createCheckMethod(requiredPrivileges, propertyName, privilegeEntry);
            return requiredPrivileges;
        }

        for (const moduleTemplate of this.moduleTemplates) {
            const propertyName = moduleTemplate.moduleName + '_' + moduleTemplate.privilege;
            requiredPrivileges[propertyName] = () => {
                const privilegeEntry = requiredPrivileges.addModulePrivilege(
                    this._tenantService.getTenantUuid(), moduleTemplate.moduleName, moduleTemplate.privilege);
                this._createCheckMethod(requiredPrivileges, propertyName, privilegeEntry);
                return requiredPrivileges;
            }
        }
        return requiredPrivileges;
    }

    _createCheckMethod(requiredPrivileges, propertyName, privilegeEntry) {
        requiredPrivileges["is_" + propertyName] = () => {
            return privilegeEntry._isGranted;
        }
    }
}