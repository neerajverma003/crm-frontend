const fs = require('fs');
const path = require('path');

const replacements = [
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/company\//g, replacement: '$1/companies/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/employee\//g, replacement: '$1/employees/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/login/g, replacement: '$1/auth/login' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/AddSuperAdmin/g, replacement: '$1/super-admin' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/getAdmins/g, replacement: '$1/admin/getAdmins' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/getAdmin\//g, replacement: '$1/admin/getAdmin/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/editAdmin\//g, replacement: '$1/admin/editAdmin/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/deleteAdmin\//g, replacement: '$1/admin/deleteAdmin/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/assign(?!\/Role|\/lead)/g, replacement: '$1/admin/assign' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/getCompanyByAdminId\//g, replacement: '$1/admin/getCompanyByAdminId/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/assignRole/g, replacement: '$1/admin/assignRole' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/getAssignedRoles/g, replacement: '$1/admin/getAssignedRoles' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/getassignedroles\//g, replacement: '$1/admin/getassignedroles/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/getSubRoleName\//g, replacement: '$1/admin/getSubRoleName/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/deleteassignedrole\//g, replacement: '$1/admin/deleteassignedrole/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/deletesubrole\//g, replacement: '$1/admin/deletesubrole/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/deletepoint\//g, replacement: '$1/admin/deletepoint/' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/b2bcompany/g, replacement: '$1/b2b/companies' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/b2b-leads/g, replacement: '$1/b2b/leads' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/b2b-operation-leads/g, replacement: '$1/b2b/operations/leads' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/superadminmylead/g, replacement: '$1/super-admin/leads/my' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/cheque/g, replacement: '$1/expenses/cheque' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/expense/g, replacement: '$1/expenses/daily' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/ledger/g, replacement: '$1/expenses/ledger' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/adminAttendance/g, replacement: '$1/admin/attendance' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/employeelead/g, replacement: '$1/employee/leads' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/department/g, replacement: '$1/admin/departments' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/designation/g, replacement: '$1/admin/designations' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/role/g, replacement: '$1/admin/roles' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/state/g, replacement: '$1/operations/states' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/destination/g, replacement: '$1/operations/destinations' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/hotel/g, replacement: '$1/operations/hotels' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/transport/g, replacement: '$1/operations/transports' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/customer/g, replacement: '$1/operations/customers' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/b2bstate/g, replacement: '$1/b2b/states' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/employeedestination/g, replacement: '$1/employee/destinations' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/assignlead/g, replacement: '$1/leads/assign' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/dispute-clients/g, replacement: '$1/dispute/clients' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/invoice/g, replacement: '$1/operations/invoices' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/salary/g, replacement: '$1/payroll/salary' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/employeerole/g, replacement: '$1/employee/roles' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/employeedata/g, replacement: '$1/employee/data' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/offer-letter/g, replacement: '$1/compliances/offer-letter' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/offer-letter-format/g, replacement: '$1/compliances/offer-letter-format' },
    { pattern: /(\$\{.*\}|API_BASE_URL|API_URL|VITE_API_URL)\/bank/g, replacement: '$1/operations/banks' },
];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src', (filePath) => {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        replacements.forEach(({ pattern, replacement }) => {
            content = content.replace(pattern, replacement);
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
