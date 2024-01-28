'use client';
import { useEffect, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import * as XLSX from 'xlsx';
import moment from 'moment';
import Swal from 'sweetalert2';
import Section from '@/components/Section';
import BreadCrumbs from '@/components/BreadCrumbs';
import OnboardingTable from '@/components/tanstack-table/OnboardingTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getObdLogs,
} from '@/service/onboarding';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';

export default function OnBoardingPage() {
  const user = usePermission();
  const [xlData, setXlData] = useState<any[]>([]);

  const queryClient = useQueryClient();

  usePwdValidityQuery(user?.id);

  const obdLogsQry = useQuery({
    queryKey: ['onboarding'],
    queryFn: getObdLogs,
    refetchOnWindowFocus: false,
  });

  // useEffect(() => {
  //   const data = document.querySelector('table')?.querySelectorAll('tr') ?? [];
  //   const rows: any[] = [];
  //   const ths = document.querySelector('table')?.querySelectorAll('th');
  //   const topColumnNames: any[] = [];
  //   const bottomColumnNames: any[] = [];
  //   ths?.forEach((th) => {
  //     topColumnNames.push(th.textContent);
  //   });

  //   let btmColNames = bottomColumnNames.filter((col) => col !== '');
  //   btmColNames = btmColNames.slice(0, btmColNames.length - 1);
  //   topColumnNames.push('');
  //   data.forEach((row) => {
  //     const cells = row.querySelectorAll('td');
  //     const rowData: any = [];
  //     cells.forEach((cell) => {
  //       rowData.push(cell.textContent);
  //     });
  //     rows.push(rowData);
  //   });
  //   let newRows = rows.filter((row) => row.length > 0);
  //   newRows = newRows.map((row) => row.slice(0, row.length - 1));
  //   const newData = [topColumnNames, btmColNames, ...newRows];
  //   setXlData(newData);
  // }, [obdLogsQry.data]);

  if (obdLogsQry.data && 'error' in obdLogsQry.data) {
    return <p>{obdLogsQry.data.error}</p>;
  }

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(xlData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
    XLSX.writeFile(wb, 'System Maintenance.xlsx');
  };

  // Maintence Data which is showing to table
  const obdLogs = obdLogsQry.data?.obdlist ?? [];
  const breadCrumbs = [{ name: 'Onboarding Link' }];

  return (
    <div className="p-4 text-[#495057] no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="eKYC Onboarding Link"
        innerTitle="Onboarding Link"
      >
        <OnboardingTable
          onClick={handleExport}
          data={obdLogsQry.isFetching ? [] : obdLogs}
          hide={false}
        />
      </Section>
    </div>
  );
}
