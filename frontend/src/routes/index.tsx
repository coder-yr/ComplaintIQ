import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { NewComplaintPage } from '../pages/NewComplaint/NewComplaintPage';
import { ReviewComplaintPage } from '../pages/ReviewComplaint/ReviewComplaintPage';

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
        element: <NewComplaintPage />
      },
      {
        path: 'complaints/review',
        element: <ReviewComplaintPage />
      }
    ]
  }
]);
