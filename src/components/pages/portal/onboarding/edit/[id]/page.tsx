'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { usePermission } from '@/hooks/usePermission';
import { ObdInput, Onboarding, createObdLog, getObdLog, updateObdLog } from '@/service/onboarding';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import moment from 'moment';

export default function EditOnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const [obdData, setObdData] = useState<ObdInput>({
    username: '',
    email: '',
    expireDate: '',
    expireTime: ''
  });
  const queryClient = useQueryClient();

  const id = params?.id;

  const getObdQry = useQuery({
    queryKey: ['getObd', id],
    queryFn: () => getObdLog(id as string),
    enabled: id !== null,
    refetchOnWindowFocus: false,
  });

  const requestObdMut = useMutation({
    mutationFn: updateObdLog,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries(['onboarding']);
      Swal.fire({
        title: 'Success!',
        text: "You've successfully updated user information.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/onboarding');
      });
    },
  });

  useEffect(() => {
    if (getObdQry.data) {
      if ("user" in getObdQry.data) {
        const data = getObdQry.data.user as Onboarding;
        setObdData({
          username: data.name,
          email: data.email,
          expireDate: moment(data.expireDate).format("YYYY-MM-DD"),
          expireTime: moment(data.expireDate).format("hh:mm")
        })
      }
    }
  }, [getObdQry.data]);

  // 
  const handleUserNameChange = (data: string) => {
    setObdData({
      ...obdData,
      username: data
    });
  }

  const handleExpireDateChange = (data: string) => {
    setObdData({
      ...obdData,
      expireDate: data
    });
  }
  
  const handleExpireTimeChange = (data: string) => {
    setObdData({
      ...obdData,
      expireTime: data
    });
  }

  // Handle Save clicked
  const saveOnboarding = async () => {
    const data: {
      name: string;
      email: string;
      expireDate: string;
    } = {
      name: obdData.username,
      email: obdData.email,
      expireDate: new Date(obdData.expireDate + ' ' + obdData.expireTime).toISOString(),
    };

    requestObdMut.mutate({
      id: id,
      obdData: data
    });
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'System Maintenance' }];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="eKYC Onboarding Link"
        innerTitle="New Request - Onboarding Link"
      >
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            saveOnboarding();
          }}
          method="post"
        >
          <table className="">
            <tbody>
              <tr>
                <td className="text-left font-bold pe-2">Name</td>
                <td className="text-left font-bold px-2">Email</td>
                <td className="text-left font-bold px-2">Expiry Date</td>
                <td className="text-left font-bold px-2">Expiry Time</td>
                <td className="text-left font-bold px-2" colSpan={2}></td>
                <td className="text-left font-bold px-2"></td>
              </tr>
              <Fragment>
                <tr>
                  <td className="pe-2">
                  <input
                      type="text"
                      value={obdData.username}
                      onChange={(e) => handleUserNameChange(e.target.value)}
                      className="form-control datetime-picker-size"
                      required
                    />
                  </td>
                  <td className="p-2">
                    {obdData.email}
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      value={obdData.expireDate}
                      onChange={(e) => handleExpireDateChange(e.target.value)}
                      className="form-control datetime-picker-size"
                      required
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      value={obdData.expireTime}
                      className="form-control datetime-picker-size"
                      onChange={(e) => handleExpireTimeChange(e.target.value)}
                      required
                    />
                  </td>
                  <td className="ps-2">
                  </td>
                </tr>
              </Fragment>
            </tbody>
          </table>

          <div className="flex justify-end gap-2 me-2">
            <Link
              href={'/portal/onboarding'}
              aria-disabled={requestObdMut.isLoading}
            >
              <button
                type="button"
                className={`bg-[#6c757d] hover:bg-[#5c636a] active:bg-[#565e64] text-white px-3 py-1 rounded-[4px] flex`}
              >
                Cancel
              </button>
            </Link>
            <button
              disabled={requestObdMut.isLoading}
              type="submit"
              className={`bg-[#3b7ddd] hover:bg-[#326abc] active:bg-[#2f64b1] text-white px-3 py-1 rounded-[4px] flex`}
            >
              Save
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}
