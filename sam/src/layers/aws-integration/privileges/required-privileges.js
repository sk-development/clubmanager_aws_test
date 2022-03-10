'use strict';

module.exports = class RequiredPrivileges {
    _requiredPrivileges = [];
    constructor() {}

    addTenantPrivilege(tenantUuid, privilege) {
        const entry = new TenantPrivilege(tenantUuid, privilege);
        this._requiredPrivileges.push(entry);
        return entry;
    }

    addModulePrivilege(tenantUuid, moduleName, privilege) {
        const entry = new ModulePrivilege(tenantUuid, moduleName, privilege);
        this._requiredPrivileges.push(entry);
        return entry;
    }

    or() {
        // by default all entries are or connected
        return this;
    }

    // and() {
    //     // by default all entries are or connected ... if AND is needed adapt here
    //     return this;
    // }

    // grantedPrivilege (tenant and module) received by the http-call to the user-api.
    verify(tenantPrivileges, modulePrivileges) {
        if (this._requiredPrivileges.length == 0)
            return true;
        
        let granted = false;
        for (const requiredPrivilege of this._requiredPrivileges) {
            let grantedPrivileges = null;
            if (requiredPrivilege instanceof TenantPrivilege) {
                grantedPrivileges = tenantPrivileges;
            } else if (requiredPrivilege instanceof ModulePrivilege) {
                grantedPrivileges = modulePrivileges;
            }

            // TODO: Möglichkeit zum and einbauen
            for (const grantedPrivilege of grantedPrivileges) {
                if (requiredPrivilege.verify(grantedPrivilege))
                    granted = true;
            }
        }
        return granted;
    }
}

class TenantPrivilege {
    _tenantUuid;
    _privilege;
    _isGranted = false;

    constructor(tenantUuid, privilege) {
        this._tenantUuid = tenantUuid;
        this._privilege = privilege;
    }

    verify(grantedPrivilege) {
        // grantedPrivilege is/are the tenantPrivileges received by the http-call
        // to the user-api. Privileges-property thereby represents the respective privileges
        this._isGranted = this._tenantUuid == grantedPrivilege.tenantUuid &&
            grantedPrivilege.privileges.includes(this._privilege);
        return this._isGranted;
    }
}

class ModulePrivilege {
    _tenantUuid;
    _moduleName;
    _privilege;
    _isGranted = false;

    constructor(tenantUuid, moduleName, privilege) {
        this._tenantUuid = tenantUuid;
        this._moduleName = moduleName;
        this._privilege = privilege;
    }

    verify(grantedPrivilege) {
        // grantedPrivilege is/are the modulePrivileges received by the http-call
        // to the user-api. Privileges-property thereby represents the respective privileges
        this._isGranted = this._tenantUuid == grantedPrivilege.tenantUuid &&
            this._moduleName == grantedPrivilege.moduleName &&
            grantedPrivilege.privileges.includes(this._privilege);
        return this._isGranted;
    }
}