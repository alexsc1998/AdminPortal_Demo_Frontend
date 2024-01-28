import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';
import { getHeader } from '@/helper';

export type Onboarding = {
  id: string;
  idx: number;
  expireDate: string;
  name: string;
  email: string;
  used: boolean;
};

// export type OnboardingTableData = {
//   id: string;
//   mid: number;
//   expireDate: string;
//   username: string;
//   email: string;
//   used: boolean;
// };

export type ObdInput = {
  expireDate: string;
  expireTime?: string;
  username: string;
  email: string;
  used?: boolean
}

export async function getObdLogs() {
  // const headers = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/users`);
  const data: { obdlist: Onboarding[] } | { error: string } = await res.json();
  return data;
}

export async function getObdLog(id: string) {
  // const headers = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/users/${id}`);
  const data: { obd: Onboarding } | { error: string } = await res.json();
  return data;
}

export async function createObdLog(
  body: {
    expireDate: string;
    name: string;
    email: string;
  }[]
) {
  const authHeader = getHeader('NORMALPOST');
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: authHeader.headers,
    body: JSON.stringify(body),
  });

  const data: MessageResponse = await res.json();
  return data;
}

export async function updateObdLog({
  id,
  obdData,
}: {
  id: string;
  obdData: {
    name: string;
    email: string;
    expireDate: string;
    used?: boolean
  };
}) {
  const authHeader = getHeader('NORMALPOST');

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: authHeader.headers,
    body: JSON.stringify(obdData),
  });

  const resData: MessageResponse = await res.json();
  return resData;
}

export async function deleteObdLog({ id }: { id: string }) {
  const authHeader = getHeader('NORMALPOST');
  const resp = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: authHeader.headers,
  });
  const resData: MessageResponse = await resp.json();
  return resData;
}
