import { useParams } from 'react-router-dom';

import {
  Button,
  Center,
  Checkbox,
  Fieldset,
  Group,
  Image,
  Loader,
  Modal,
  NativeSelect,
  NumberInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { MemberType } from '../../shared/MemberType';
import { useAppDispatch, useAppSelector } from '../../store';
import { useEffect, useState } from 'react';
import { loadedMemberData, updateMember } from './memberSlice';

const initialState: MemberType = {
  fullname: '',
  generation: 1,
  phoneNumber: '',
  email: '',
  address: '',
  occupation: '',
  linkedin: '',
  instagram: '',
  twitter: '',
  bloodType: '',
  inGroup: false,
  createdBy: 1,
};

type MemberVieWDetailProp = {
  isPublic?: boolean;
};

function MemberViewDetail({ isPublic = true }: MemberVieWDetailProp) {
  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);
  const [isEdit, setIsEdit] = useState(false);

  const { memberID } = useParams();

  const { isLoading, memberData } = useAppSelector((state) => state.member);
  const dispatch = useAppDispatch();
  const memberForm = useForm({
    initialValues: initialState,
  });

  useEffect(() => {
    dispatch(loadedMemberData(Number(memberID)));
  }, [dispatch, memberID]);

  useEffect(() => {
    memberForm.setValues((prev) => ({ ...prev, ...memberData }));
  }, [memberData]);

  async function handleUpdateMember(id: number, newMember: MemberType) {
    await dispatch(updateMember(id, newMember));
    openSuccess();
    setIsEdit((cur) => !cur);
  }

  return (
    <Center px={'2rem'} py={'2rem'}>
      <Stack w={'100%'}>
        <Title order={2}>Detail Anggota</Title>
        <form
          onSubmit={memberForm.onSubmit((val) => {
            handleUpdateMember(Number(memberID), val);
          })}
        >
          <Fieldset m={0} disabled={!isEdit}>
            <Stack>
              <TextInput
                label='Nama'
                {...memberForm.getInputProps('fullname')}
                required
              />

              <NumberInput
                label='Angkatan Organisasi'
                {...memberForm.getInputProps('generation')}
                required
                min={1}
              />
              <TextInput
                label='Nomor Telepon'
                {...memberForm.getInputProps('phoneNumber')}
                required
              />
              <TextInput label='Email' {...memberForm.getInputProps('email')} />
              <TextInput
                label='Alamat Rumah'
                {...memberForm.getInputProps('address')}
                required
              />

              <TextInput
                label='Pekerjaan'
                {...memberForm.getInputProps('occupation')}
                required
              />
              <TextInput
                label='LinkedIn'
                {...memberForm.getInputProps('linkedin')}
              />
              <TextInput
                label='Instagram'
                {...memberForm.getInputProps('instagram')}
              />
              <TextInput
                label='Twitter / X'
                {...memberForm.getInputProps('twitter')}
              />
              <NativeSelect
                data={[
                  { label: 'Tidak Tahu', value: '' },
                  'A+',
                  'A-',
                  'B+',
                  'B-',
                  'AB+',
                  'AB-',
                  'O+',
                  'O-',
                ]}
                label='Golongan Darah'
                {...memberForm.getInputProps('bloodType')}
                required
              />

              <Checkbox
                label='Sudah masuk di dalam group Whatsapp organisasi?'
                {...memberForm.getInputProps('inGroup')}
                checked={memberForm.values.inGroup}
                my={'md'}
              />
            </Stack>
          </Fieldset>

          {!isPublic ? (
            isEdit ? (
              <Group>
                <Button
                  type='button'
                  mt={'lg'}
                  loading={isLoading}
                  onClick={() => setIsEdit((cur) => !cur)}
                  color='red'
                >
                  Batalkan
                </Button>
                <Button type='submit' mt={'lg'} loading={isLoading}>
                  Simpan Data Anggota
                </Button>{' '}
              </Group>
            ) : (
              <Button
                type='button'
                mt={'lg'}
                loading={isLoading}
                onClick={() => setIsEdit((cur) => !cur)}
              >
                Update Data Anggota
              </Button>
            )
          ) : null}
        </form>
      </Stack>

      <Modal
        opened={openedSuccess}
        onClose={() => {
          closeSuccess();
        }}
        closeOnClickOutside={false}
      >
        <Stack align='center'>
          {isLoading ? (
            <Loader type='bars' size={'xl'} m={'xl'} />
          ) : (
            <>
              <Image src={'/thankyou-logo.svg'} alt='Thankyou' />
              <Title order={3}>Data anggota telah diupdate</Title>
              <Button
                fullWidth
                onClick={() => {
                  closeSuccess();
                }}
              >
                Back
              </Button>
            </>
          )}
        </Stack>
      </Modal>
    </Center>
  );
}

export default MemberViewDetail;
