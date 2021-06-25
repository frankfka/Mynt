import { Button, Col, Form, Image, Input, Row } from 'antd';
import React from 'react';

const { TextArea } = Input;

function GeneralInformationSection() {
  return (
    <Row className="GeneralInformationSection">
      {/*Profile info form*/}
      <Col flex="auto" className="ProfileInfoFormCol">
        <Form layout="vertical">
          <Form.Item label="Display Name">
            <Input value="Frank Jia" />
          </Form.Item>
          <Form.Item label="Email">
            <Input value="jiafrank98@gmail.com" />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input value="7783849871" />
          </Form.Item>
          <Form.Item label="Profile Description">
            <TextArea value="Lorem ipsum" rows={5} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Save</Button>
          </Form.Item>
        </Form>
      </Col>
      {/*Profile Photo*/}
      <Col className="ProfileImageCol">
        <Image
          src="https://avatars.githubusercontent.com/u/31530056?s=400&u=9ca43bcabd1ac6462d03d878713c0fe2d5df965e&v=4"
          className="ProfileImage"
        />
        <div>
          <Button type="link">Edit</Button>
        </div>
      </Col>
    </Row>
  );
}

export default GeneralInformationSection;
