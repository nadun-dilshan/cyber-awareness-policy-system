import React from 'react';
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
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const adminNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/policies', icon: FileText, label: 'Policies' },
    { to: '/policies/upload', icon: Upload, label: 'Upload Policy' },
    { to: '/trainings', icon: GraduationCap, label: 'Training' },
    { to: '/trainings/create', icon: Plus, label: 'Create Training' },
    { to: '/incidents', icon: AlertTriangle, label: 'Incidents' },
    { to: '/incidents/report', icon: Plus, label: 'Report Incident' },
    { to: '/compliance', icon: CheckSquare, label: 'Compliance' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/audit', icon: History, label: 'Audit Logs' },
    { to: '/users', icon: Users, label: 'Users' },
  ];

  const employeeNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/policies', icon: FileText, label: 'My Policies' },
    { to: '/trainings', icon: GraduationCap, label: 'My Training' },
    { to: '/incidents', icon: AlertTriangle, label: 'My Incidents' },
    { to: '/incidents/report', icon: Plus, label: 'Report Incident' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const navItems = isAdmin() ? adminNavItems : employeeNavItems;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;