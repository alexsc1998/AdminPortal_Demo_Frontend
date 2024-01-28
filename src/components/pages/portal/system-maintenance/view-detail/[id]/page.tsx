'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { usePermission } from '@/hooks/usePermission';
import {
  SysMaintenance,
  approveMntLogs,
  getMntLog,
  rejectMntLogs,
} from '@/service/system-maintenance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import Swal from 'sweetalert2';
import RejectionModal from '../../rejection/modal/page';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';

export default function ViewMaintenancePage() {
  const user = usePermission();
  const params = useParams();
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);
  const [mntLog, setMntLog] = useState<SysMaintenance>();

  usePwdValidityQuery(user?.id);

  const id = params?.id;

  const getMntQry = useQuery({
    queryKey: ['getMnt', id],
    queryFn: () => getMntLog(id as string),
    enabled: id !== null,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const approveMut = useMutation({
    mutationFn: approveMntLogs,
    onSuccess: async (data) => {
      if ('error' in data) {
        await Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      Swal.fire({
        title: 'Success!',
        text: "You've successfully approved the system maintenance schedule.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/system-maintenance');
      });
    },
  });

  const rejectMut = useMutation({
    mutationFn: rejectMntLogs,
    onSuccess: async (data) => {
      if ('error' in data) {
        await Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      Swal.fire({
        title: 'Success!',
        text: "You've successfully rejected the system maintenance schedule.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/system-maintenance');
      });
    },
  });

  useEffect(() => {
    if (getMntQry.data) {
      if ('mntLog' in getMntQry.data) {
        setMntLog(getMntQry.data.mntLog);
      }
    }
  }, [getMntQry.data]);

  // Handle events
  const handleApproveClick = () => {
    approveMut.mutate({
      ids: [id],
      email: user?.email ?? '',
    });
  };

  const handleRejectClick = async () => {
    await Swal.fire({
      title: 'Reject',
      inputLabel: 'Please provide rejection reason:',
      input: 'textarea',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reason = result.value as string;
        rejectMut.mutate({
          ids: [id],
          email: user?.email ?? '',
          msg: reason,
        });
      }
    });
  };

  const handleViewLogClick = () => {
    setVisible(true);
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'System Maintenance' }];

  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="OBW System Maintenance" innerTitle="">
        <div className="w-full flex gap-2 text-[#495057]">
          <div className="w-1/3">
            <div>
              <div className="w-[120px] inline-block">Submitted Date</div>
              <div className="font-bold inline-block">
                :{' '}
                {mntLog?.submittedAt
                  ? moment(new Date(mntLog?.submittedAt)).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  : ''}
              </div>
            </div>
            <div>
              <div className="w-[120px] inline-block">Submitted By</div>
              <div className="font-bold inline-block">
                : {mntLog?.submittedBy}
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div>
              <div className="w-[200px] inline-block">
                Approved/Rejected Date
              </div>
              <div className="font-bold inline-block">
                :{' '}
                {mntLog?.updatedAt && mntLog.approvedBy !== ''
                  ? moment(new Date(mntLog?.updatedAt)).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  : ''}
              </div>
            </div>
            <div>
              <div className="w-[200px] inline-block">Approved/Rejected By</div>
              <div className="font-bold inline-block">
                : {mntLog?.approvedBy}
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div>
              <div className="w-[120px] inline-block">Request Status</div>
              <div className="font-bold inline-block">
                :&nbsp;
                {mntLog?.approvalStatus === undefined ? (
                  ''
                ) : mntLog?.approvalStatus === 'Pending' ? (
                  <span className="font-semibold">Pending</span>
                ) : mntLog?.approvalStatus === 'Rejected' ? (
                  <span className="text-red-500 font-semibold">Rejected</span>
                ) : (
                  <span className="text-[#3b7ddd] font-semibold">Approved</span>
                )}
              </div>
            </div>
            <div>
              <div className="w-[120px] inline-block">Submission</div>
              <div className="font-bold inline-block">
                : {mntLog?.submissionStatus}
              </div>
            </div>
          </div>
        </div>
        <table className="mt-3 text-[#495057]">
          <tbody>
            <tr>
              <td className="font-bold pe-1">From Date</td>
              <td className="font-bold px-1">From Time</td>
              <td className="font-bold px-1">To Date</td>
              <td className="font-bold px-1">To Time</td>
              <td className="font-bold px-1" colSpan={2}></td>
              <td className="font-bold ps-1"></td>
            </tr>
            <tr>
              <td className="pe-1">
                <input
                  type="date"
                  className="form-control datetime-picker-size"
                  value={
                    mntLog?.startDate
                      ? moment(new Date(mntLog?.startDate)).format('YYYY-MM-DD')
                      : ''
                  }
                  readOnly
                  required
                />
              </td>
              <td className="px-1">
                <input
                  type="time"
                  className="form-control datetime-picker-size"
                  value={
                    mntLog?.startDate
                      ? moment(new Date(mntLog?.startDate)).format('HH:mm')
                      : ''
                  }
                  readOnly
                  required
                />
              </td>
              <td className="px-1">
                <input
                  type="date"
                  className="form-control datetime-picker-size"
                  value={
                    mntLog?.endDate
                      ? moment(new Date(mntLog?.endDate)).format('YYYY-MM-DD')
                      : ''
                  }
                  readOnly
                  required
                />
              </td>
              <td className="px-1">
                <input
                  type="time"
                  className="form-control datetime-picker-size"
                  value={
                    mntLog?.endDate
                      ? moment(new Date(mntLog?.endDate)).format('HH:mm')
                      : ''
                  }
                  readOnly
                  required
                />
              </td>
              <td className="ps-3 pe-2">
                <input
                  readOnly
                  type="checkbox"
                  checked={mntLog?.iRakyatYN}
                  className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
                />
                &nbsp;iRakyat
              </td>
              <td className="ps-2">
                <input
                  readOnly
                  type="checkbox"
                  checked={mntLog?.iBizRakyatYN}
                  className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
                />
                &nbsp;iBizRakyat
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end gap-1">
          <button
            disabled={approveMut.isLoading || rejectMut.isLoading}
            type="submit"
            className={`bg-[#3b7ddd] hover:bg-[#326abc] active:bg-[#2f64b1] text-white px-3 py-1 rounded-[4px] flex`}
            onClick={handleViewLogClick}
          >
            View Log
          </button>
          <Link
            href={'/portal/system-maintenance'}
            aria-disabled={approveMut.isLoading || rejectMut.isLoading}
          >
            <button
              type="button"
              className={`bg-[#6c757d] hover:bg-[#5c636a] active:bg-[#565e64] text-white px-3 py-1 rounded-[4px] flex`}
            >
              Cancel
            </button>
          </Link>
          {user?.role === 'manager 2' &&
            mntLog?.approvalStatus != 'Approved' &&
            mntLog?.approvalStatus != 'Rejected' &&
            mntLog?.iBizRakyatStatus !== 'C' &&
            mntLog?.iRakyatStatus !== 'C' && (
              <>
                <button
                  disabled={approveMut.isLoading || rejectMut.isLoading}
                  type="submit"
                  id="btnApproved"
                  className="text-white bg-green-500 hover:bg-green-600 rounded-[0.2rem] px-[0.75rem] py-[0.25rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                  onClick={handleApproveClick}
                >
                  Approve
                </button>
                <button
                  disabled={approveMut.isLoading || rejectMut.isLoading}
                  type="button"
                  id="btnRejected"
                  className="text-white bg-red-500 hover:bg-red-600 rounded-[0.2rem] px-[0.75rem] py-[0.25rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                  onClick={handleRejectClick}
                >
                  Reject
                </button>
              </>
            )}
        </div>

        <RejectionModal id={id} visible={visible} setVisible={setVisible} />
      </Section>
    </div>
  );
}
