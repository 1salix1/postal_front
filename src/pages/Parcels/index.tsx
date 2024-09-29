import React, { useEffect, useState } from 'react'
import { Pagination, Popconfirm, Row, Table } from 'antd'
import { Link } from 'react-router-dom'
import IParcel from '../../models/parcel'
import AddParcel from '../../modals/Parcel/addParcel'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { addNotification } from 'store/reducers/notificationHandler'
import { deleteParcel, getParcels } from 'store/reducers/parcelReducer'

const Parcels: React.FC = () => {
  const dispatch = useAppDispatch()
  const { error, isLoading, total, parcels } = useAppSelector(state => state.parcelReducer)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  useEffect(() => {
    dispatch(getParcels({ limit, page: currentPage }))
  }, [limit, currentPage])

  useEffect(() => {
    if (!isLoading && error) {
      dispatch(addNotification({ message: error, type: 'error' }))
    }
  }, [error, isLoading])

  const onDelete = (id: number) => {
    dispatch(deleteParcel(id))
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Трекномер',
      dataIndex: 'trackNumber',
      key: 'trackNumber',
    },
    {
      title: 'Настоящий трекномер',
      dataIndex: 'realTrackNumber',
      key: 'realTrackNumber',
    },
    {
      title: 'Последний статус',
      key: 'lastStatus',
      dataIndex: 'lastStatus',
    },
    {
      title: 'Дата последнего статуса',
      key: 'lastStatusDate',
      dataIndex: 'lastStatusDate',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: string, record: IParcel) => (
        <div>
          <Link to={'/parcel'} state={{ parcelId: record.id }}>
            <EditFilled />
          </Link>
          <Popconfirm
            title='Удалить отправление'
            description='Подтвердите удаление отправления'
            onConfirm={() => onDelete(record.id)}
            okText='Подтверждаю'
            cancelText='Отмена'
          >
            <DeleteFilled />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className={'parcels'}>
      <div className={'container'}>
        <Row justify={'space-between'} className={'parcels_header'}>
          <h3>Список отправлений</h3>
          <AddParcel />
        </Row>

        <Table
          className={'desktop'}
          loading={isLoading}
          columns={columns}
          dataSource={parcels.map(parcel => {
            return {
              key: parcel.id,
              ...parcel,
              lastStatus: parcel?.statuses[0]?.description,
              lastStatusDate: parcel?.statuses[0]?.createdAt,
            }
          })}
          pagination={{
            //hideOnSinglePage: true,
            pageSize: limit,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            total: total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setCurrentPage(page)
              setLimit(pageSize)
            },
          }}
        />
        <div className={'mobile'}>
          {parcels.map(parcel => {
            return (
              <div key={parcel.id} className={'parcel'}>
                <div className={'parcel__info'}>
                  <div className={'parcel__track'}>{parcel.trackNumber}</div>
                  <div className={'parcel__status'}>{parcel?.statuses[0]?.description}</div>
                  <div className={'parcel__status_date'}>{parcel?.statuses[0]?.createdAt}</div>
                </div>
                <div className={'parcel__actions'}>
                  <Link to={'/parcel'} state={{ parcelId: parcel.id }}>
                    <EditFilled />
                  </Link>
                  <Popconfirm
                    title='Удалить отправление'
                    description='Подтвердите удаление отправления'
                    onConfirm={() => deleteParcel(parcel.id)}
                    okText='Подтверждаю'
                    cancelText='Отмена'
                  >
                    <DeleteFilled />
                  </Popconfirm>
                </div>
              </div>
            )
          })}
          <Pagination
            rootClassName={'mobile-pagination'}
            onChange={(page, pageSize) => {
              setCurrentPage(page)
              setLimit(pageSize)
            }}
            current={currentPage}
            showSizeChanger={true}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}

export default Parcels
