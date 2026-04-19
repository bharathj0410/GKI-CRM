# 🔐 Access Control System - Implementation Guide

## Overview
This document explains how to implement and use the table-level access control system throughout the application.

## How It Works

### 1. **Setting Up Permissions (Admin)**
When adding a new CRM user in the **Add Employee** form:

1. Select which pages/tables the user can access
2. For each table, assign specific permissions:
   - **👁️ View** - Can see records
   - **✏️ Edit** - Can modify records
   - **🗑️ Delete** - Can remove records

### 2. **Data Structure**
User permissions are stored in the database as:

```javascript
{
  "permissions": ["employee", "visitors", "costing"],
  "tableAccess": {
    "employee": ["view", "edit"],
    "visitors": ["view", "edit", "delete"],
    "costing": ["view"]
  }
}
```

## Implementation Pattern

### Step 1: Import Auth Hook
```javascript
import { useAuth } from '@/contexts/AuthContext'
```

### Step 2: Get Access Functions
```javascript
const { hasTableAccess } = useAuth()
```

### Step 3: Check Permissions
```javascript
const canView = hasTableAccess('employee', 'view')
const canEdit = hasTableAccess('employee', 'edit')
const canDelete = hasTableAccess('employee', 'delete')
```

### Step 4: Conditionally Render UI Elements
```javascript
{canEdit && (
    <Button onPress={handleEdit}>Edit</Button>
)}

{canDelete && (
    <Button color='danger' onPress={handleDelete}>Delete</Button>
)}
```

## Real Examples from Codebase

### Example 1: Employee Card Dropdown
```javascript
// components/EmployeeCard.jsx
import { useAuth } from '@/contexts/AuthContext'

export default function EmployeeCard({ Employee, onEdit, onDelete, onClick }) {
    const { hasTableAccess } = useAuth();
    
    const canView = hasTableAccess('employee', 'view');
    const canEdit = hasTableAccess('employee', 'edit');
    const canDelete = hasTableAccess('employee', 'delete');

    return (
        <DropdownMenu>
            {canView && (
                <DropdownItem onPress={onClick}>
                    View Details
                </DropdownItem>
            )}
            {canEdit && (
                <DropdownItem onPress={() => onEdit(Employee)}>
                    Edit Employee
                </DropdownItem>
            )}
            {canDelete && (
                <DropdownItem onPress={() => onDelete(Employee)}>
                    Delete Employee
                </DropdownItem>
            )}
        </DropdownMenu>
    )
}
```

### Example 2: Employee Details Page
```javascript
// app/employee/details/[id]/page.jsx
const { hasTableAccess } = useAuth()
const canEdit = hasTableAccess('employee', 'edit')
const canDelete = hasTableAccess('employee', 'delete')

// In header buttons
{canEdit && (
    <Button onPress={handleEditToggle}>
        {isEditing ? 'Save Changes' : 'Edit Details'}
    </Button>
)}

{canDelete && (
    <Button color='danger'>Delete</Button>
)}

// In documents section
{canEdit && (
    <Button onPress={() => setShowDocModal(true)}>
        Add Document
    </Button>
)}

{canDelete && (
    <Button color='danger' onPress={() => deleteDocument(doc.id)}>
        Delete
    </Button>
)}
```

### Example 3: Temp Employee Component
```javascript
// components/TempEmployee/index.jsx
const { hasTableAccess } = useAuth()

const canView = hasTableAccess('employee', 'view')
const canEdit = hasTableAccess('employee', 'edit')
const canDelete = hasTableAccess('employee', 'delete')

<DropdownMenu>
    {canView && (
        <DropdownItem onPress={() => router.push(`/employee/details/${id}`)}>
            View Details
        </DropdownItem>
    )}
    {canEdit && (
        <DropdownItem onPress={handleEdit}>Edit</DropdownItem>
    )}
    {canDelete && (
        <DropdownItem onPress={handleDelete}>Delete</DropdownItem>
    )}
</DropdownMenu>
```

## Available Tables

| Table Key | Description |
|-----------|-------------|
| `dashboard` | Dashboard (no granular access) |
| `employee` | Employee Management |
| `stocks` | Stocks Management |
| `costing` | Costing & Quotations |
| `visitors` | Visitors Management |
| `job` | Job Management |
| `config` | Configuration |

## Access Types

| Access Type | Purpose |
|-------------|---------|
| `view` | Read-only access to records |
| `edit` | Modify existing records |
| `delete` | Remove records |

## Where to Implement

### ✅ Already Implemented
- ✅ Employee Card dropdown menu
- ✅ Temp Employee card dropdown menu
- ✅ Employee Details page (Edit, Delete, Verify buttons)
- ✅ Document upload/delete in Employee Details
- ✅ AuthContext with `hasTableAccess()` function

### 🔄 Need to Implement
Apply the same pattern to:

#### Visitors Management
```javascript
// app/visitors/components/VisitorsTable.jsx
const canView = hasTableAccess('visitors', 'view')
const canEdit = hasTableAccess('visitors', 'edit')
const canDelete = hasTableAccess('visitors', 'delete')
```

#### Costing/Quotations
```javascript
// app/costing/page.jsx
const canView = hasTableAccess('costing', 'view')
const canEdit = hasTableAccess('costing', 'edit')
const canDelete = hasTableAccess('costing', 'delete')
```

#### Stocks Management
```javascript
// app/stocks/* components
const canView = hasTableAccess('stocks', 'view')
const canEdit = hasTableAccess('stocks', 'edit')
const canDelete = hasTableAccess('stocks', 'delete')
```

#### Job Management
```javascript
// app/job/* components
const canView = hasTableAccess('job', 'view')
const canEdit = hasTableAccess('job', 'edit')
const canDelete = hasTableAccess('job', 'delete')
```

## Admin Override

**Important:** Admin users (`role === 'admin'`) bypass ALL access checks and have full access to everything.

The `hasTableAccess()` function automatically returns `true` for admin users:

```javascript
const hasTableAccess = (table, accessType) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin bypass
    
    if (!user.permissions?.includes(table)) return false;
    if (!user.tableAccess || !user.tableAccess[table]) return false;
    
    return user.tableAccess[table].includes(accessType);
};
```

## Testing Access Control

### Test Scenario 1: Limited User
```javascript
User: { 
    permissions: ["employee", "visitors"],
    tableAccess: {
        "employee": ["view"],
        "visitors": ["view", "edit", "delete"]
    }
}
```

**Expected Behavior:**
- ✅ Can view employees
- ❌ Cannot edit employees
- ❌ Cannot delete employees
- ✅ Can view, edit, and delete visitors

### Test Scenario 2: Power User
```javascript
User: {
    permissions: ["employee", "visitors", "costing"],
    tableAccess: {
        "employee": ["view", "edit", "delete"],
        "visitors": ["view", "edit"],
        "costing": ["view"]
    }
}
```

**Expected Behavior:**
- ✅ Full access to employees
- ✅ Can view and edit visitors (no delete)
- ✅ Can view costing (read-only)

## Best Practices

1. **Always check before showing buttons/actions**
   ```javascript
   {canDelete && <Button>Delete</Button>}
   ```

2. **Provide user feedback when access denied**
   ```javascript
   {!canEdit && <Chip>Read-only access</Chip>}
   ```

3. **Verify on backend too** (security layer)
   - Front-end checks are for UX
   - Backend API should also validate permissions

4. **Use consistent naming**
   - `canView`, `canEdit`, `canDelete`
   - Makes code easier to read

5. **Group related checks**
   ```javascript
   const access = {
       view: hasTableAccess('employee', 'view'),
       edit: hasTableAccess('employee', 'edit'),
       delete: hasTableAccess('employee', 'delete')
   }
   ```

## Quick Reference

```javascript
// 1. Import
import { useAuth } from '@/contexts/AuthContext'

// 2. Get hook
const { hasTableAccess } = useAuth()

// 3. Check access
const canView = hasTableAccess('tableName', 'view')
const canEdit = hasTableAccess('tableName', 'edit')
const canDelete = hasTableAccess('tableName', 'delete')

// 4. Conditionally render
{canView && <ViewButton />}
{canEdit && <EditButton />}
{canDelete && <DeleteButton />}
```

## Summary

The access control system is now fully functional for employee management. To extend it to other sections:

1. Import `useAuth` hook
2. Call `hasTableAccess(table, accessType)`
3. Conditionally render UI elements based on returned boolean
4. Admin users automatically bypass all checks

This provides a secure, granular permission system where admins can control exactly what each user can do in different sections of the application.
