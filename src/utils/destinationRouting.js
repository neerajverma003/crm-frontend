/**
 * Utility for handling destination-based lead routing
 * When a lead is saved with a destination, it checks if another employee
 * is assigned to that destination and moves the lead to them
 */

/**
 * Fetch all employees with their assigned destinations
 */
export const fetchEmployeesWithDestinations = async () => {
  try {
    const res = await fetch("http://localhost:4000/employee/allEmployee");
    const data = await res.json();
    
    if (Array.isArray(data.employees)) {
      // Filter employees who have destinations assigned
      return data.employees.filter((emp) => 
        emp.destinations && Array.isArray(emp.destinations) && emp.destinations.length > 0
      );
    }
    return [];
  } catch (err) {
    console.error("Error fetching employees with destinations:", err);
    return [];
  }
};

/**
 * Find the employee assigned to a specific destination
 * @param {string} destinationName - The destination name to search for
 * @param {string} currentEmployeeId - The current employee ID (to exclude self)
 * @returns {Promise<Object|null>} - The employee object or null if not found
 */
export const findEmployeeByDestination = async (destinationName, currentEmployeeId) => {
  if (!destinationName || !destinationName.trim()) return null;

  try {
    const employees = await fetchEmployeesWithDestinations();
    console.log("🔎 Employees with destinations:", employees.length);
    
    const destinationLower = destinationName.toLowerCase().trim();
    console.log("🔎 Looking for destination:", destinationLower);
    
    for (const emp of employees) {
      // Skip current employee
      if (emp._id === currentEmployeeId) {
        console.log("⏭️ Skipping current employee:", emp.fullName);
        continue;
      }
      
      // Check if this employee has the destination assigned
      if (Array.isArray(emp.destinations)) {
        console.log(`👤 Checking ${emp.fullName}, has ${emp.destinations.length} destinations:`, 
          emp.destinations.map(d => d.destination || d));
        
        const hasDestination = emp.destinations.some((dest) => {
          const destName = dest && dest.destination 
            ? dest.destination.toLowerCase().trim()
            : String(dest).toLowerCase().trim();
          return destName === destinationLower;
        });
        
        if (hasDestination) {
          console.log("✅ Found matching employee:", emp.fullName);
          return emp;
        }
      }
    }
    
    console.log("❌ No employee found for destination:", destinationName);
    return null;
  } catch (err) {
    console.error("Error finding employee by destination:", err);
    return null;
  }
};

/**
 * Handle lead routing when saved
 * If the lead's destination matches another employee's assigned destination,
 * reassign the lead to that employee
 * 
 * @param {Object} leadData - The lead data being saved
 * @param {string} currentEmployeeId - Current employee ID
 * @param {string} leadId - Lead ID (for updates)
 * @returns {Promise<Object>} - Returns { routed: boolean, targetEmployeeId: string or null, targetEmployeeName: string or null }
 */
export const handleDestinationBasedRouting = async (leadData, currentEmployeeId, leadId = null) => {
  try {
    console.log("🔍 Routing Check:", { destination: leadData.destination, currentEmployeeId, leadId });
    
    const targetEmployee = await findEmployeeByDestination(leadData.destination, currentEmployeeId);
    console.log("🎯 Target Employee Found:", targetEmployee ? { id: targetEmployee._id, name: targetEmployee.fullName } : "None");
    
    if (targetEmployee) {
      // Create or update the lead with the new employee
      const method = leadId ? "PUT" : "POST";
      const url = leadId 
        ? `http://localhost:4000/employeelead/${leadId}`
        : "http://localhost:4000/employeelead";

      const payload = {
        ...leadData,
        employee: targetEmployee._id,
        employeeId: targetEmployee._id,
        routedFromEmployee: currentEmployeeId,  // Track the original employee who routed this lead
      };

      console.log("📤 Sending routed lead payload:", { destination: payload.destination, toEmployee: targetEmployee._id, fromEmployee: currentEmployeeId });

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("✅ Lead successfully routed!");
        return {
          routed: true,
          targetEmployeeId: targetEmployee._id,
          targetEmployeeName: targetEmployee.fullName || targetEmployee.firstName + " " + targetEmployee.lastName,
          message: `Lead automatically routed to ${targetEmployee.fullName || targetEmployee.firstName + " " + targetEmployee.lastName} (assigned to ${leadData.destination})`
        };
      } else {
        console.error("❌ Failed to route lead:", res.status, res.statusText);
      }
    }

    // No routing needed, save to current employee
    console.log("➡️ No routing needed, saving to current employee");
    return {
      routed: false,
      targetEmployeeId: null,
      targetEmployeeName: null,
      message: null
    };
  } catch (err) {
    console.error("❌ Error in destination-based routing:", err);
    return {
      routed: false,
      targetEmployeeId: null,
      targetEmployeeName: null,
      error: err.message
    };
  }
};

/**
 * Fetch leads assigned by destination for current employee
 * Returns leads that were routed to this employee based on destination matching
 */
export const fetchLeadsAssignedByDestination = async (employeeId) => {
  if (!employeeId) return [];

  try {
    const res = await fetch(`http://localhost:4000/employeelead/employee/${employeeId}`);
    if (!res.ok) throw new Error("Failed to fetch leads");
    
    const data = await res.json();
    return data.leads || [];
  } catch (err) {
    console.error("Error fetching leads assigned by destination:", err);
    return [];
  }
};
