import { Avatar, Button, Col, Image, Row } from 'antd';
import Link from 'next/link';
import React from 'react';

require('./NavBar.less');

function NavBar() {
  return (
    <Row align="middle" justify="space-between" className="NavBar">
      <Col>
        <Image
          src="https://www.rapyd.net/wp-content/uploads/2020/02/rapyd-logo-png-reverse.png"
          height={32}
        />
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
                src="https://avatars.githubusercontent.com/u/31530056?s=400&u=9ca43bcabd1ac6462d03d878713c0fe2d5df965e&v=4"
              />
            </a>
          </Link>
        </Row>
      </Col>
    </Row>
  );
}

export default NavBar;
