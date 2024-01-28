'use client';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '../helper/index';
// import { SysMaintenance } from '@/service/system-maintenance';
import { Onboarding } from '@/service/onboarding';
import moment from 'moment';
import { usePermission } from '@/hooks/usePermission';

export const onboardingColumns = (
  qrcode: (obd: Onboarding) => JSX.Element,
  actions: (obd: Onboarding) => JSX.Element
) => {
  let columns: ColumnDef<Onboarding>[] = [];
  const user = usePermission();

  columns = [
    {
      header: 'No.#',
      accessorFn: (row) => row.idx,
      accessorKey: 'idx',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'QRCode',
      accessorKey: 'qrcode',
      cell: (props) => qrcode(props.row.original)
    },
    {
      enablePinning: true,
      header: 'Expire Date',
      accessorKey: 'expireDate',
      cell: (props) => moment(props.row.original.expireDate).format('DD/MM/YYYY HH:mm'),
    },
    {
      header: 'Customer name',
      accessorFn: (row) => row.name,
      accessorKey: 'name',
      enableSorting: true,
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Email Address',
      accessorFn: (row) => row.email,
      accessorKey: 'email',
      enableSorting: true,
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Used',
      accessorFn: (row) => row.used,
      accessorKey: 'used',
      cell: (props) => props.row.original.used ? "Yes" : "No",
    },
    {
      header: 'Action',
      enableSorting: false,
      cell: (props) => actions(props.row.original),
    },
  ];

  // if (user?.role == 'manager 2') {
  //   columns.unshift({
  //     header: '',
  //     accessorFn: (row) => row.id,
  //     accessorKey: 'id',
  //     enableSorting: false,
  //     cell: (props) => checkboxes(props.row.original),
  //   });
  // }

  return columns;
};
