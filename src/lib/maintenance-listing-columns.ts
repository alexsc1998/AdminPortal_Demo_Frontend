'use client';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '../helper/index';
import { SysMaintenance } from '@/service/system-maintenance';
import moment from 'moment';
import { usePermission } from '@/hooks/usePermission';

export const maintenanceListingColumns = (
  checkboxes: (mnt: SysMaintenance) => JSX.Element,
  channels: (mnt: SysMaintenance) => JSX.Element,
  actions: (mnt: SysMaintenance) => JSX.Element
) => {
  let columns: ColumnDef<SysMaintenance>[] = [];
  const user = usePermission();

  columns = [
    {
      header: 'No.#',
      accessorFn: (row) => row.mid,
      accessorKey: 'mid',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Maintenance Period',
      accessorKey: 'period',
      accessorFn: (row) => {
        return (
          moment(row.startDate).format('YYYY-MM-DD HH:mm') +
          '@' +
          moment(row.endDate).format('YYYY-MM-DD HH:mm')
        );
      },
      cell: (props) =>
        moment(props.row.original.startDate).format('DD/MM/YYYY HH:mm') +
        ' - ' +
        moment(props.row.original.endDate).format('DD/MM/YYYY HH:mm'),
    },
    {
      enablePinning: true,
      header: 'Maintenance Channel',
      accessorKey: 'channelStatus',
      accessorFn: (row) => {
        let res = '';
        if (
          (row.iRakyatStatus != '' &&
            row.approvalStatus != 'Pending' &&
            row.approvalStatus != 'Rejected') ||
          row.submissionStatus == 'Marked'
        )
          res += row.iRakyatStatus;
        if (
          (row.iBizRakyatStatus != '' &&
            row.approvalStatus != 'Pending' &&
            row.approvalStatus != 'Rejected') ||
          row.submissionStatus == 'Marked'
        )
          res += row.iBizRakyatStatus;
        return res;
      },
      enableSorting: false,
      cell: (props) => channels(props.row.original),
    },
    {
      header: 'Submission',
      accessorFn: (row) => row.submissionStatus,
      accessorKey: 'submissionStatus',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Request Status',
      accessorFn: (row) => row.approvalStatus,
      accessorKey: 'approvalStatus',
      enableSorting: true,
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Submit Date',
      accessorFn: (row) => row.submittedAt,
      accessorKey: 'submittedAt',
      cell: (props) =>
        moment(props.row.original.submittedAt).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      header: 'Action',
      enableSorting: false,
      cell: (props) => actions(props.row.original),
    },
  ];

  if (user?.role == 'manager 2') {
    columns.unshift({
      header: '',
      accessorFn: (row) => row.id,
      accessorKey: 'id',
      enableSorting: false,
      cell: (props) => checkboxes(props.row.original),
    });
  }

  return columns;
};
