"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
var UserRole;
(function (UserRole) {
    UserRole[UserRole["SUPERADMIN"] = 1] = "SUPERADMIN";
    UserRole[UserRole["ADMIN"] = 2] = "ADMIN";
    UserRole[UserRole["TEACHER"] = 3] = "TEACHER";
    UserRole[UserRole["ACCOUNTANT"] = 4] = "ACCOUNTANT";
    UserRole[UserRole["LIBRARIAN"] = 5] = "LIBRARIAN";
    UserRole[UserRole["PARENT"] = 6] = "PARENT";
    UserRole[UserRole["STUDENT"] = 7] = "STUDENT";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=roles.decorator.js.map