import {
  Button,
  Center,
  Checkbox,
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
import { MemberType } from '../../../shared/MemberType';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createMember } from '../memberSlice';
import { useDisclosure } from '@mantine/hooks';

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

function MemberForm() {
  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  const { isLoading } = useAppSelector((state) => state.member);
  const dispatch = useAppDispatch();
  const memberForm = useForm({
    initialValues: initialState,
  });

  async function handleCreateMember(newMember: MemberType) {
    await dispatch(createMember(newMember));
    openSuccess();
    memberForm.reset();
  }

  return (
    <Center px={'4rem'} py={'2rem'}>
      <Stack w={'100%'}>
        <Title order={2}>Form Tambah Anggota</Title>
        <form onSubmit={memberForm.onSubmit((val) => handleCreateMember(val))}>
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
            />

            <Checkbox
              label='Sudah masuk di dalam group Whatsapp organisasi?'
              // description='Sudah masuk di dalam group Whatsapp organisasi?'
              {...memberForm.getInputProps('inGroup')}
              my={'md'}
            />
          </Stack>

          <Button type='submit' mt={'lg'} loading={isLoading}>
            Tambah Anggota
          </Button>
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
              <Title order={3}>Anggota baru telah ditambah</Title>
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

export default MemberForm;
