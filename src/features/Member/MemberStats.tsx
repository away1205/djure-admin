import StatsCard from '../../UI/StatsCard';
import { MemberType } from '../../shared/MemberType';

type CardProp = {
  memberList: MemberType[];
};

export function TotalMemberCard({ memberList }: CardProp) {
  return (
    <StatsCard
      stat={{
        title: 'Jumlah Anggota',
        icon: 'user',
        value: `${memberList.length} Anggota`,
        diff: 0,
      }}
      isCompare={false}
      isCurrency={false}
    />
  );
}
