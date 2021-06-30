import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Row } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

require('./NavBar.less');

function NavBar() {
  const userContext = useContext(UserContext);

  return (
    <Row align="middle" justify="space-between" className="NavBar">
      <Col>
        <Image src={'/header_logo.png'} height={48} width={48} />
      </Col>
      <Col className="MenuItems">
        <Row align="middle">
          <Button type="link" className="MenuLinkButton" size="large">
            Explore
          </Button>
          <Button type="link" className="MenuLinkButton" size="large">
            How It Works
          </Button>
          <Link href="/wallet">
            <Button type="primary" className="CreateTokenButton" size="large">
              Your Wallet
            </Button>
          </Link>
          <Link href="/profile">
            <a className="ProfileAvatar">
              <Avatar
                size="large"
                src={userContext.userData?.dbData.profileImage}
                icon={<UserOutlined />}
              />
            </a>
          </Link>
        </Row>
      </Col>
    </Row>
  );
}

export default NavBar;
