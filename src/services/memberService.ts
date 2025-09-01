/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supabase from './supabase';
import { MemberType } from '../shared/MemberType';

const memberTable = 'member';

export async function getAllMemberService() {
  const { data, error } = await supabase
    .from(memberTable)
    .select('*')
    .order('fullname', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function filterMemberService(
  filterBy: string,
  filterValue: string | number
) {
  const { data, error } =
    typeof filterValue === 'string'
      ? await supabase
          .from(memberTable)
          .select('*')
          .order('fullname', { ascending: false })
          .ilike(filterBy, `%${filterValue}%`)
      : await supabase
          .from(memberTable)
          .select('*')
          .order('fullname', { ascending: false })
          .eq(filterBy, filterValue);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function createMemberService(newMember: MemberType) {
  const { data, error } = await supabase
    .from(memberTable)
    .insert(newMember)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function updateMemberService(
  memberID: number,
  newDetail: MemberType
) {
  const { data, error } = await supabase
    .from(memberTable)
    .update(newDetail)
    .eq('id', memberID)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data[0];
}

export async function deleteMemberService(memberID: number) {
  const { data, error } = await supabase
    .from(memberTable)
    .delete()
    .eq('id', memberID);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
