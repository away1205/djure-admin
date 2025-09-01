import { Group, NumberFormatter, Paper, Text } from '@mantine/core';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCoin,
  IconDiscount2,
  IconReceipt2,
  IconUserPlus,
  TablerIconsProps,
} from '@tabler/icons-react';
import classes from './StatsCard.module.css';

type IconType = (props: TablerIconsProps) => JSX.Element;

const icons: { [key: string]: IconType } = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

type StatsCardProp = {
  stat: {
    title: string;
    icon: string;
    value: number | string;
    diff: number;
  };
  isCurrency?: boolean;
  isCompare?: boolean;
};

function StatsCard({
  stat,
  isCurrency = true,
  isCompare = true,
}: StatsCardProp) {
  const Icon = icons[stat.icon];
  const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Paper
      withBorder
      p='md'
      radius='md'
      key={stat.title}
      h={'100%'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Group justify='space-between'>
        <Text size='xs' c='dimmed' className={classes.title}>
          {stat.title}
        </Text>
        <Icon className={classes.icon} size='1.4rem' stroke={1.5} />
      </Group>

      <Group align='flex-end' gap='xs' mt={25}>
        <Text className={classes.value}>
          {isCurrency ? (
            <NumberFormatter
              value={stat.value}
              prefix='Rp. '
              thousandSeparator
            />
          ) : (
            stat.value
          )}
        </Text>

        {isCompare && (
          <Text
            c={stat.diff > 0 ? 'teal' : 'red'}
            fz='sm'
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size='1rem' stroke={1.5} />
          </Text>
        )}
      </Group>

      {isCompare && (
        <Text fz='xs' c='dimmed' mt={7}>
          Compared to previous month
        </Text>
      )}
    </Paper>
  );
}

export default StatsCard;
