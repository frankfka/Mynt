import { Tabs } from 'antd';
import React from 'react';
import NavBar from '../NavBar/NavBar';
import GeneralInformationSection from './GeneralInformationSection/GeneralInformationSection';
import WithdrawFundsSection from './WithdrawFundsSection/WithdrawFundsSection';

const { TabPane } = Tabs;

require('./ProfilePage.less');

function ProfilePage() {
  return (
    <div className="AppPage">
      <NavBar />
      <div className="ProfilePageContent">
        <h1>Your Profile</h1>

        <Tabs tabPosition="left" className="ProfileTabs">
          <TabPane tab="General" key="1">
            <GeneralInformationSection />
          </TabPane>
          <TabPane tab="Recent Activity" key="2" />
          <TabPane tab="Notifications" key="3" />
          <TabPane tab="Appearance" key="4" />
          <TabPane tab="Security" key="5" />
          <TabPane tab="Withdraw Funds" key="6">
            <WithdrawFundsSection />
          </TabPane>
          <TabPane tab="Payment Info" key="7" />
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePage;
