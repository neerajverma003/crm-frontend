import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './EmpSidebarNav'
import navigation from '../../nav/nav_emp'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <>
      <CSidebar
        className={`border-end custom-sidebar ${unfoldable ? 'sidebar-collapsed' : ''}`}
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        style={{
          zIndex: 1030,
          width: unfoldable ? '80px' : '250px'
        }}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible })
        }}
      >
        <CSidebarHeader className="px-3" style={{ height: '30px' }}>
          <CSidebarBrand to="/" className="d-flex align-items-center gap-2">
            <CIcon icon="cil-user" height={24} className="text-primary" />
            {!unfoldable && <span className="fw-bold fs-5">EMP Management</span>}
          </CSidebarBrand>
          <CCloseButton
            className="d-lg-none"
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </CSidebarHeader>
        <AppSidebarNav items={navigation} />
      </CSidebar>
    </>
  )
}

export default React.memo(AppSidebar)