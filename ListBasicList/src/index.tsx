import React, { FC, useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface PAGE_NAME_UPPER_CAMEL_CASEProps {
  BLOCK_NAME_CAMEL_CASE: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({
  data: { owner, createdAt, percent, status },
}: {
  data: BasicListItemDataType;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{owner}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>Tiempo de empezar</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
    </div>
  </div>
);

export const PAGE_NAME_UPPER_CAMEL_CASE: FC<PAGE_NAME_UPPER_CAMEL_CASEProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    BLOCK_NAME_CAMEL_CASE: { list },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);

  useEffect(() => {
    dispatch({
      type: 'BLOCK_NAME_CAMEL_CASE/fetch',
      payload: {
        count: 5,
      },
    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: 50,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    dispatch({
      type: 'BLOCK_NAME_CAMEL_CASE/submit',
      payload: { id },
    });
  };

  const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: 'Eliminar tarea',
        content: '¿Seguro que quieres eliminar esta tarea?',
        okText: 'confirmar',
        cancelText: 'cancelar',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">Todas</RadioButton>
        <RadioButton value="progress">Procesando</RadioButton>
        <RadioButton value="waiting">Esperando</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="por favor introduzca" onSearch={() => ({})} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: BasicListItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">editar</Menu.Item>
          <Menu.Item key="delete">borrar</Menu.Item>
        </Menu>
      }
    >
      <a>
        Más <DownOutlined />
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    const id = current ? current.id : '';

    setAddBtnblur();

    setDone(true);
    dispatch({
      type: 'BLOCK_NAME_CAMEL_CASE/submit',
      payload: { id, ...values },
    });
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="Tareas" value="8" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="Tiempo promedio de procesamiento de tareas esta semana" value="32 minutos" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="Tareas completadas esta semana" value="24" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="Lista básica"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              añadir
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      editar
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
    BLOCK_NAME_CAMEL_CASE,
    loading,
  }: {
    BLOCK_NAME_CAMEL_CASE: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    BLOCK_NAME_CAMEL_CASE,
    loading: loading.models.BLOCK_NAME_CAMEL_CASE,
  }),
)(PAGE_NAME_UPPER_CAMEL_CASE);
