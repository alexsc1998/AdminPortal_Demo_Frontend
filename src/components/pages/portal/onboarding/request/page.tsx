'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { usePermission } from '@/hooks/usePermission';
import { ObdInput, createObdLog } from '@/service/onboarding';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function RequestMaintenancePage() {
  const user = usePermission();
  const router = useRouter();
  const [rows, setRows] = useState<ObdInput[]>([]);
  const queryClient = useQueryClient();

  usePwdValidityQuery(user?.id);

  const requestObdMut = useMutation({
    mutationFn: createObdLog,
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
        text: "You’ve successfully created the onboarding link.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/onboarding');
      });
    },
  });

  useEffect(() => {
    if (!rows.length) {
      addMntRow();
    }
  }, []);

  // Add new maintenance row
  const addMntRow = () => {
    setRows([
      ...rows,
      {
        username: '',
        email: '',
        expireDate: '',
        expireTime: ''
      },
    ]);
  };

  const deleteRows = (index: number) => {
    const tmpRows = rows.slice();
    tmpRows.splice(index, 1);
    setRows(tmpRows);
  };

  // Handle Input Data Change
  const handleUserNameChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as ObdInput;
    curData.username = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleEmailChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as ObdInput;
    curData.email = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleToDateChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as ObdInput;
    curData.expireDate = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleToTimeChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as ObdInput;
    curData.expireTime = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  // Handle Save clicked
  const saveOnboarding = async () => {
    const data: {
      name: string;
      email: string;
      expireDate: string;
    }[] = [];

    for (let i = 0; i < rows.length; ++i) {
      const item = rows[i];
      data.push({
        name: item.username,
        email: item.email,
        expireDate: new Date(item.expireDate + ' ' + item.expireTime).toISOString(),
      });
    }

    requestObdMut.mutate(data);
  };

  const handleSaveClicked = async () => {
    const tmpRows: ObdInput[] = [];
    for (let i = 0; i < rows.length; ++i) {
      const item = rows[i];
      const tmpItem = item;

      tmpRows.push(tmpItem);
    }

    setRows(tmpRows);
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
          <div className="flex justify-end items-center">
            <button
              type="button"
              className="text-blue-600 flex items-center hover:text-blue-400 active:text-blue-700 me-2"
              onClick={() => addMntRow()}
            >
              <FiPlus className="inline-block bg-blue-600 rounded-full text-white me-1" />
              Add New Link
            </button>
          </div>
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
              {rows.map((item: ObdInput, index: number) => (
                <Fragment key={index}>
                  <tr>
                    <td className="pe-2">
                      <input
                        type="text"
                        value={item.username}
                        onChange={(e) =>
                          handleUserNameChange(e.target.value, index)
                        }
                        className="form-control datetime-picker-size"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="email"
                        value={item.email}
                        onChange={(e) =>
                          handleEmailChange(e.target.value, index)
                        }
                        className="form-control datetime-picker-size"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        id={`endDate${index}`}
                        value={item.expireDate}
                        onChange={(e) =>
                          handleToDateChange(e.target.value, index)
                        }
                        className="form-control datetime-picker-size"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="time"
                        id={`endTime${index}`}
                        value={item.expireTime}
                        className="form-control datetime-picker-size"
                        onChange={(e) =>
                          handleToTimeChange(e.target.value, index)
                        }
                        required
                      />
                    </td>
                    <td className="ps-2">
                      <button
                        type="button"
                        className={`bg-[#dc3545] active:bg-[#de4060] text-white px-3 py-1 rounded-[4px] flex ${
                          index ? '' : 'hidden'
                        }`}
                        onClick={() => deleteRows(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </Fragment>
              ))}
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
              onClick={handleSaveClicked}
            >
              Save
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}
