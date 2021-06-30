import { Button, Col, Form, Image, Input, Row } from 'antd';
import React, { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import LoadingView from '../../LoadingView/LoadingView';

const { TextArea } = Input;

function GeneralInformationSection() {
  const { userData } = useContext(UserContext);

  if (userData == null) {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <LoadingView />
      </div>
    );
  }

  return (
    <Row className="GeneralInformationSection">
      {/*Profile info form*/}
      <Col flex="auto" className="ProfileInfoFormCol">
        <Form layout="vertical">
          <Form.Item label="Display Name">
            <Input value={userData.dbData.name} />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={userData.dbData.email} />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input value={userData.dbData.phoneNumber} />
          </Form.Item>
          <Form.Item label="Profile Description">
            <TextArea value={userData.dbData.profileDescription} rows={5} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Save</Button>
          </Form.Item>
        </Form>
      </Col>
      {/*Profile Photo*/}
      <Col className="ProfileImageCol">
        <Image src={userData.dbData.profileImage} className="ProfileImage" />
        <div>
          <Button type="link">Edit</Button>
        </div>
      </Col>
    </Row>
  );
}

export default GeneralInformationSection;
