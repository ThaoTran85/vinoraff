import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import AdminLayout from 'components/layout/admin';
import { Avatar, Button, Col, Row } from 'antd';
import styles from './canhan.module.css';

export default function CaNhan() {
    return (
        <div className={styles.db__6}>
            <Content>
              <Row>
                <Col span={24}>
                  <Row>
                    <Col span={6}>
                      <Avatar >A</Avatar>
                      </Col>
                      <Col span={12}>
                        Info</Col>

                        <Col span={6}>
                          <div>
                            <Button type='link'>Cập nhật thông tin</Button>
                            <Button type='link'>Cập nhật mật khẩu</Button>
                            </div></Col>
                  </Row>
                  </Col>
              </Row>
            </Content>
        </div>
    );
}
CaNhan.Layout = AdminLayout;
