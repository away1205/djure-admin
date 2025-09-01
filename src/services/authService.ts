// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supabase from './supabase';

export async function adminAuthService(email: string, password: string) {
  const { data, error } = await supabase
    .from('admin')
    .select('*')
    .eq('email', email);

  if (error) {
    console.log(error);
    return error;
  }

  if (email === data[0]?.email && password === data[0]?.password) {
    return true;
  } else {
    return false;
  }
}
