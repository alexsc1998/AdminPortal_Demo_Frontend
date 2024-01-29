"use client"

import { checkObdLog, getObdLog, updateObdLog } from "@/service/onboarding";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from 'sweetalert2'

export default function CheckOnboardingPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id;

  const checkObdQry = useQuery({
    queryKey: ['getObd', id],
    queryFn: () => checkObdLog(id as string),
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
      window.location.href = "https://dot.innovatrics.com";
    },
  });

  useEffect(() => {
    if (checkObdQry.data) {
      if ("error" in checkObdQry.data) {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: checkObdQry.data.error,
        }).then(() => {
          router.push('/portal/onboarding');
        });
      } else {
        const data = checkObdQry.data.user;

        console.log(checkObdQry.data);

        requestObdMut.mutate({
          id: data.id,
          obdData: {
            name: data.name,
            email: data.email,
            expireDate: data.expireDate,
            used: true
          }
        })
      }
    }
  }, [checkObdQry.data]);

  return <></>;
}