'use strict';

module.exports = class SurveyModuleInfo {
    NAME = "survey";
    PRIVILEGE = {
        ADMIN: "admin",
        ORGANIZER: "organizer",
        USER: "user"
    };

    constructor() {}

    register(privilegesHandler) {
        privilegesHandler.registerModulePrivilege(this.NAME, this.PRIVILEGE.ADMIN);
        privilegesHandler.registerModulePrivilege(this.NAME, this.PRIVILEGE.ORGANIZER);
        privilegesHandler.registerModulePrivilege(this.NAME, this.PRIVILEGE.USER);
    }
}