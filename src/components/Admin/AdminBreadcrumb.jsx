import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import routes from '../../routes/routes_emp'
import { Home, ChevronRight } from 'lucide-react'

const AdminBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location
      .split('/')
      .filter(Boolean)
      .reduce((prev, curr, index, array) => {
        const currentPathname = `${prev}/${curr}`
        const routeName = getRouteName(currentPathname, routes)
        if (routeName) {
          breadcrumbs.push({
            pathname: currentPathname,
            name: routeName,
            active: index + 1 === array.length,
          })
        }
        return currentPathname
      }, '')
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  // If no breadcrumbs, we can just return null or just the home icon
  if (breadcrumbs.length === 0) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap py-3 px-4 bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-gray-100/50 mb-6 w-full">
        <Link 
          to="/admin/dashboard" 
          className="flex items-center text-gray-400 hover:text-indigo-600 transition-colors duration-200 shrink-0"
        >
          <Home className="w-4 h-4" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap py-3 px-4 bg-white/70 backdrop-blur-md rounded-xl shadow-sm border border-gray-100/50 mb-6 w-full">
      <Link 
        to="/admin/dashboard" 
        className="flex items-center text-gray-400 hover:text-indigo-600 transition-all duration-300 hover:scale-110 shrink-0"
        title="Dashboard Home"
      >
        <Home className="w-[18px] h-[18px]" />
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center space-x-2 shrink-0">
          <ChevronRight className="w-4 h-4 text-gray-300" />
          {breadcrumb.active ? (
            <span className="font-semibold text-gray-800 tracking-wide text-xs sm:text-sm bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-100/50 shadow-inner">
              {breadcrumb.name}
            </span>
          ) : (
            <Link 
              to={breadcrumb.pathname}
              className="text-gray-500 hover:text-indigo-600 font-medium transition-colors duration-200 text-xs sm:text-sm hover:underline underline-offset-4 decoration-indigo-300"
            >
              {breadcrumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

export default React.memo(AdminBreadcrumb)
