/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supabase from './supabase';
import {
  DetailTransactionType,
  TransactionType,
} from '../shared/TransactionType';

const transactionTable = 'transaction';
const detailTransactionTable = 'transactionDetail';

export async function getAllTransactionService() {
  const { data, error } = await supabase
    .from(transactionTable)
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
export async function getSpecificTransactionService(query: string) {
  const { data, error } = await supabase
    .from(transactionTable)
    .select(query)
    .order('createdAt', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getPaginationTransactionService(
  from: number,
  to: number,
  filterColumn: string = '',
  pattern: string = ''
) {
  const { data, error } = await supabase
    .from(transactionTable)
    .select()
    .order('createdAt', { ascending: false })
    .range(from, to)
    .like(filterColumn, `%${pattern}%`);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getTransactionLengthService(
  filterColumn: string = '',
  pattern: string = ''
) {
  const { count, error } = await supabase
    .from(transactionTable)
    .select('*', { count: 'exact', head: true })
    .like(filterColumn, `%${pattern}%`);

  if (error) {
    console.log(error);
    return error;
  }

  return count;
}

export async function createTransactionService(
  newTransaction: TransactionType
) {
  const { data, error } = await supabase
    .from(transactionTable)
    .insert(newTransaction)
    .select('*');

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function deleteTransactionService(id: number) {
  const { data, error } = await supabase
    .from(transactionTable)
    .delete()
    .eq('id', id);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getDetailTransactionService(id: number) {
  const { data, error } = await supabase
    .from(detailTransactionTable)
    .select('*')
    .eq('transactionID', id);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function createDetailTransactionService(
  newDetailTransaction: DetailTransactionType[]
) {
  const { data, error } = await supabase
    .from(detailTransactionTable)
    .insert(newDetailTransaction)
    .select('*');

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
