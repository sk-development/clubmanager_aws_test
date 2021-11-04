var user;
var admin;

function processModulePrivileges(event) {
    const globalAdmin = event.requestContext.authorizer.isGlobalAdmin;
    const modulePrivileges = event.requestContext.authorizer.modulePrivileges;
    if(globalAdmin == 'true' || modulePrivileges.includes('admin')) {
        admin = true
        user = true
    } else if (modulePrivileges.includes('user')) {
        admin = false
        user = true
    } else {
        admin = false
        user = false
    }
}

function isUser() {
    return user;
}

function isAdmin() {
    return admin;
}

module.exports = {
    processModulePrivileges: processModulePrivileges,
    isUser: isUser,
    isAdmin: isAdmin
};