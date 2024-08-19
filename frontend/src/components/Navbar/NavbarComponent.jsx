import {  CButton, CCollapse, CContainer, CForm, CFormInput, CNavbar, CNavbarBrand, CNavbarNav, CNavbarToggler, CNavItem, CNavLink } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import './navbar.css';

export default function NavbarComponent() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <CNavbar expand="lg" className="bg-transparent " >
        <CContainer fluid className='padded-container'>
          <CNavbarToggler
            style={{ color: 'white', borderColor: 'white' }}
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}

          />
          <CNavbarBrand href="/" className='new-amsterdam-regular'  style={{ color: 'white', fontSize: '2rem' }}>ScreenCode</CNavbarBrand>
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav  className="monospace-text me-auto mb-2 mb-lg-0">
              <CNavItem>
                <CNavLink style={{ color: 'white' }} href="/films" active>
                  Films
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink style={{ color: 'white' }} href="/cinemas">Cinemas</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink style={{ color: 'white' }} href="#" disabled>
                  Disabled
                </CNavLink>
              </CNavItem>
            </CNavbarNav>
            <CForm className="monospace-text d-flex">
              <CFormInput type="search" className="me-2" placeholder="Search" />
              <CButton style={{ color: 'white' }} type="submit" color="success" variant="outline">
                Search
              </CButton>
            </CForm>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
}
