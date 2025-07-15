import { Outlet } from "react-router-dom";

/**
 * Main application component that serves as the root component
 * Uses React Router's Outlet to render matched child routes
 * 
 * @returns {JSX.Element} The outlet for rendering child routes
 */
export default function App() {
  return <Outlet />;
}