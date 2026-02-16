import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppHeaderDropdown } from './index'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CForm,
  CFormInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu, cilSearch } from '@coreui/icons'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      try {
        headerRef.current?.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      } catch (error) {
        console.error('Scroll handler error:', error)
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <CHeader 
      position="sticky" 
      className="mb-4 p-0" 
      ref={headerRef} 
      style={{ 
        height: '56px',
        zIndex: 1020,
        backgroundColor: 'white'
      }}
    >
      <CContainer className="px-4" fluid style={{ paddingLeft: '2rem' }}>
        <div className="d-flex align-items-center justify-content-between w-100" style={{ height: '56px' }}>
          <div className="d-flex align-items-center">
            <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              className="me-2"
              style={{ padding: '0.25rem 0.5rem' }}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
          </div>

          {/* Search Bar */}
          <div className="d-flex align-items-center" style={{ width: '15%', maxWidth: '500px'}}>
            <CForm className="w-100">
              <div className="input-group" style={{ height: '30px' }}>
                <CFormInput 
                  type="text" 
                  placeholder="Search..." 
                  aria-label="Search"
                  className="border-end-0"
                  style={{ borderRadius: '18px 0 0 18px', padding: '0.25rem 1rem' }}
                />
                <span 
                  className="input-group-text bg-white border-start-0" 
                  style={{ borderRadius: '0 18px 18px 0', cursor: 'pointer' }}
                >
                  <CIcon icon={cilSearch} />
                </span>
              </div>
            </CForm>
          </div>

          <div className="d-flex align-items-center">
            {/* Notifications Dropdown */}
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false} className="px-2" style={{ padding: '0.25rem 0.5rem' }}>
                <CIcon icon={cilBell} size="lg" />
              </CDropdownToggle>
              <CDropdownMenu className="pt-0">
                <CDropdownItem header className="bg-light fw-bold">Notifications</CDropdownItem>
                <CDropdownItem>🔔 You have a new message from Admin</CDropdownItem>
                <CDropdownItem>✅ Task "Project Update" marked as complete</CDropdownItem>
                <CDropdownItem>📅 Meeting scheduled for 3 PM today</CDropdownItem>
                <CDropdownItem>📢 New company policy has been published</CDropdownItem>
                <CDropdownItem href="/notifications" className="text-center text-primary">
                  View all notifications
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            {/* Profile Dropdown */}
            <AppHeaderDropdown />
          </div>
        </div>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader