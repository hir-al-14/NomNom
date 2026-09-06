import type { Restriction } from '../domain';
import { restrictionLabel } from '../domain';
import { Body } from './ui';
import { Card, Pill, Section } from './Primitives';

export function FoodNoteCard({ name, restrictions }: { name: string; restrictions: Restriction[] }) {
  return <Card>
    <Body>Customer Food-note</Body>
    <Section>{name.trim() || 'Name not provided'}</Section>
    <Body>Dietary restrictions</Body>
    {!restrictions.length && <Body>No dietary restrictions selected.</Body>}
    {restrictions.map(({ tag, severity }, index) => <Pill key={`${tag}-${index}`} tone={severity}>
      {restrictionLabel(tag)} · {severity}
    </Pill>)}
  </Card>;
}
