import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Pagination, Popconfirm, Row, Table } from 'antd'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store/store'
import { deleteParcel, getParcelsList, getUser } from '../../store/actions'
import { Link, useNavigate } from 'react-router-dom'
import IParcel from '../../models/parcel'
import AddParcel from '../../modals/Parcel/addParcel'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
const mapStateToProps = (state: RootState) => ({
  parcels: state.parcelReducer.parcels,
  isLoading: state.parcelReducer.isLoading,
  total: state.parcelReducer.total,
})
const mapDispatchToProps = {
  getParcelsList,
  deleteParcel,
  getUser,
}
const connector = connect(mapStateToProps, mapDispatchToProps)

type ParcelsProps = ConnectedProps<typeof connector>

const Parcels: React.FC<ParcelsProps> = ({ parcels, getParcelsList, isLoading, total, deleteParcel }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const fetchData = async () => {
    getParcelsList(currentPage, limit)
  }
  useEffect(() => {
    fetchData().catch(e => console.log(e))
  }, [limit, currentPage])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Track Number',
      dataIndex: 'trackNumber',
      key: 'trackNumber',
    },
    {
      title: 'Real Track Number',
      dataIndex: 'realTrackNumber',
      key: 'realTrackNumber',
    },
    {
      title: 'Last Status',
      key: 'lastStatus',
      dataIndex: 'lastStatus',
    },
    {
      title: 'Last Status Date',
      key: 'lastStatusDate',
      dataIndex: 'lastStatusDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: IParcel) => (
        <div>
          <Link to={'/parcel'} state={{ parcelId: record.id }}>
            <EditFilled />
          </Link>
          <Popconfirm
            title='Delete the Parcel'
            description='Are you sure to delete this Parcel?'
            onConfirm={() => deleteParcel(record.id)}
            okText='Yes'
            cancelText='No'
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
          <h3>Parcels List</h3>
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
              lastStatus: parcel.statuses[0].description,
              lastStatusDate: parcel.statuses[0].createdAt,
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
                  <div className={'parcel__status'}>{parcel.statuses[0].description}</div>
                  <div className={'parcel__status_date'}>{parcel.statuses[0].createdAt}</div>
                </div>
                <div className={'parcel__actions'}>
                  <Link to={'/parcel'} state={{ parcelId: parcel.id }}>
                    <EditFilled />
                  </Link>
                  <Popconfirm
                    title='Delete the Parcel'
                    description='Are you sure to delete this Parcel?'
                    onConfirm={() => deleteParcel(parcel.id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <DeleteFilled />
                  </Popconfirm>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default connector(Parcels)
