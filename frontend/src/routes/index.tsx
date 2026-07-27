import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import LogCustomerComplaint from '../pages/NewComplaint/NewComplaintPage';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'complaints/new',
        element: <LogCustomerComplaint />
      }
    ]
  }
]);
