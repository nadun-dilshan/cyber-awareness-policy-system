import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const adminNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    {
      icon: FileText,
      label: 'Policies',
      children: [
        { to: '/policies', label: 'All Policies' },
        { to: '/policies/upload', label: 'Upload Policy', icon: Upload },
      ],
    },
    {
      icon: GraduationCap,
      label: 'Training',
      children: [
        { to: '/trainings', label: 'All Trainings' },
        { to: '/trainings/create', label: 'Create Training', icon: Plus },
      ],
    },
    {
      icon: AlertTriangle,
      label: 'Incidents',
      children: [
        { to: '/incidents', label: 'All Incidents' },
        { to: '/incidents/report', label: 'Report Incident', icon: Plus },
      ],
    },
    { to: '/compliance', icon: CheckSquare, label: 'Compliance' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/audit', icon: History, label: 'Audit Logs' },
    { to: '/users', icon: Users, label: 'Users' },
  ];

  const employeeNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    {
      icon: FileText,
      label: 'My Policies',
      children: [{ to: '/policies', label: 'All Policies' }],
    },
    {
      icon: GraduationCap,
      label: 'My Training',
      children: [{ to: '/trainings', label: 'View Trainings' }],
    },
    {
      icon: AlertTriangle,
      label: 'My Incidents',
      children: [
        { to: '/incidents', label: 'All Incidents' },
        { to: '/incidents/report', label: 'Report Incident', icon: Plus },
      ],
    },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const navItems = isAdmin() ? adminNavItems : employeeNavItems;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => toggleMenu(item.label)}
                className="flex items-center justify-between w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
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
              {openMenus[item.label] && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-md transition-colors duration-200 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
