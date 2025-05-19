"use client"
import React, { useState, useEffect } from 'react';
import { House, Video, BookOpenCheck, ArrowLeftRight, BookCheck, CircleUserRound } from 'lucide-react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { Layout, Menu, theme } from 'antd';
import logo from "./../../image/happy_citizen.png"
import Image from 'next/image';
import Home from './Home';
const { Header, Sider, Content } = Layout;
import ProfileComponent from './Profile';
import NotificationsPage from './Notification';
import FeedbackHistories from './home/feedBackHistory';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [isSiderVisible, setIsSiderVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile && !isMobile) {
        setIsSiderVisible(false);
      } else if (!mobile) {
        setIsSiderVisible(true);
      }
    };

    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const handleMenuClick = (e: MenuInfo) => {
    setSelectedKey(e.key);
    if (isMobile) {
      setIsSiderVisible(false);
    }
  };

  const toggleMobileSider = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSiderVisible(!isSiderVisible);
  };

  const toggleDesktopSider = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: '1',
      icon: <House size={20} />,
      label: 'Home',
    },
    {
      key: '2',
      icon: <Video size={20}/>,
      label: 'Complaint',
    },
    {
      key: '3',
      icon: <BookOpenCheck size={20} />,
      label: 'FeedBack',
    },
    {
      key: '4',
      icon: <ArrowLeftRight size={20} />,
      label: 'notification',
    },
    {
      key: '5',
      icon: <BookCheck size={20}/>,
      label: 'setting',
    }
  ];

  const profileItem = {
    key: '6',
    icon: <CircleUserRound size={20} color='orange'/>,
    label: <span className="text-orange-300">Profile</span>,
    className: 'profile-menu-item'
  };

  return (
    <Layout className="min-h-screen">
      {isMobile && isSiderVisible && (
        <div 
          className="fixed inset-0 bg-black bg-blue-500/15 backdrop-blur-sm z-20"
          onClick={() => setIsSiderVisible(false)}
        />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={isMobile ? false : collapsed}
        className={`
          ${isMobile ? 'fixed z-30 h-full' : 'relative'} 
          ${isSiderVisible || !isMobile ? 'block' : 'hidden'} 
          min-h-screen transition-all duration-300
        `}
        style={{ backgroundColor: '#2563eb' }}
        width={200}
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div className='bg-white w-full flex justify-center items-center'>
          <Image 
            src={logo} 
            width={isMobile ? 100 : collapsed ? 50 : 100} 
            alt='logo image' 
            height={isMobile ? 80 : collapsed ? 50 : 80} 
            className="object-contain py-2" 
          />
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          style={{ backgroundColor: '#2563eb' }}
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
        
        <div className='absolute bottom-0 left-0 right-0'>
          <Menu
            theme="dark"
            mode="inline"
            style={{ backgroundColor: '#2563eb' }}
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={[profileItem]}
          />
        </div>
      </Sider>

      <Layout>
        <Header
          className="sticky top-0 z-10 w-full flex items-center shadow-sm"
          style={{
            background: colorBgContainer,
            padding: '0 16px',
            height: '64px',
          }}
        >
          <button
            onClick={isMobile ? toggleMobileSider : toggleDesktopSider}
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isMobile ? 
              (isSiderVisible ? 
                <MenuFoldOutlined style={{ fontSize: 24 }} /> : 
                <MenuUnfoldOutlined style={{ fontSize: 24 }} />) : 
              
              (collapsed ? 
                <MenuUnfoldOutlined style={{ fontSize: 24 }} /> : 
                <MenuFoldOutlined style={{ fontSize: 24 }} />)
            }
          </button>

          <div className="ml-4 text-lg font-medium">
            {selectedKey === '1' ? 'Home' : 
             selectedKey === '2' ? 'Complaint' :
             selectedKey === '3' ? 'Reading' :
             selectedKey === '4' ? 'Payment' :
             selectedKey === '5' ? 'Exam' :
             selectedKey === '6' ? 'Profile' : ''}
          </div>
        </Header>

        <Content
          className="p-4 sm:p-6 overflow-x-auto hide-scrollbar"
          style={{
            margin: isMobile ? '8px' : '16px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: "calc(100vh - 64px - 32px)",
          }}
        >
          {selectedKey === '1' ? <Home /> :
           selectedKey === '2' ? <Histories /> :
           selectedKey === '3' ? <FeedbackHistories /> :
           selectedKey === '4' ? <NotificationsPage /> :
           selectedKey === '6' ? <ProfileComponent /> :
           <h1>Content coming soon</h1>}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;