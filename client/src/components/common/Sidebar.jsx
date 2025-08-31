import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  AlertTriangle,
  CheckSquare,
  Bell,
  History,
  Upload,
  Plus,
  Users,
  BarChart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Define grouped nav items
  const adminNavItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      icon: FileText,
      label: "Policies",
      children: [
        { to: "/policies", label: "All Policies" },
        { to: "/policies/upload", label: "Upload Policy", icon: Upload },
      ],
    },
    {
      icon: GraduationCap,
      label: "Training",
      children: [
        { to: "/trainings", label: "All Trainings" },
        { to: "/trainings/create", label: "Create Training", icon: Plus },
        { to: "/trainings/results", label: "Training Results", icon: BarChart },
      ],
    },
    {
      icon: AlertTriangle,
      label: "Incidents",
      children: [
        { to: "/incidents", label: "All Incidents" },
        { to: "/incidents/report", label: "Report Incident", icon: Plus },
      ],
    },
    { to: "/compliance", icon: CheckSquare, label: "Compliance" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/audit", icon: History, label: "Audit Logs" },
    { to: "/users", icon: Users, label: "Users" },
  ];

  const employeeNavItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      icon: FileText,
      label: "My Policies",
      children: [{ to: "/policies", label: "All Policies" }],
    },
    {
      icon: GraduationCap,
      label: "My Training",
      children: [
        { to: "/trainings", label: "Trainings" },
        { to: "/trainings/results", label: "My Training Results", icon: BarChart },
      ],
    },
    {
      icon: AlertTriangle,
      label: "My Incidents",
      children: [
        { to: "/incidents", label: "All Incidents" },
        { to: "/incidents/report", label: "Report Incident", icon: Plus },
      ],
    },
    { to: "/notifications", icon: Bell, label: "Notifications" },
  ];

  const navItems = isAdmin() ? adminNavItems : employeeNavItems;

  // Auto-expand menus if current route belongs to them
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (location.pathname.startsWith(child.to)) {
            setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
          }
        });
      }
    });
  }, [location.pathname]);

  return (
    <div className="w-64 min-h-screen p-4 text-white bg-gray-900">
      <nav className="space-y-2">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              {/* Parent item (toggle) */}
              <button
                onClick={() => toggleMenu(item.label)}
                className="flex items-center justify-between w-full p-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white"
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </div>
                {openMenus[item.label] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Submenu items */}
              {openMenus[item.label] && (
                <div className="mt-1 ml-6 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-md transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`
                      }
                    >
                      {child.icon && (
                        <child.icon className="w-4 h-4 mr-2 opacity-75" />
                      )}
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
