import { DiscordActionRow, DiscordButton } from '@derockdev/discord-components-react';
import type { APIActionRowComponent, APIActionRowComponentTypes, APIButtonComponentWithURL} from 'seyfert/lib/types';
import { ButtonStyle, ComponentType } from 'seyfert/lib/types';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';

export default function ComponentRow({ row, id }: { row: APIActionRowComponent<APIActionRowComponentTypes>; id: number }) {
  return (
    <DiscordActionRow key={id}>
      {row.components.map((component, id) => (
        <Component component={component} id={id} key={id} />
      ))}
    </DiscordActionRow>
  );
}

const ButtonStyleMapping = {
  [ButtonStyle.Primary]: 'primary',
  [ButtonStyle.Secondary]: 'secondary',
  [ButtonStyle.Success]: 'success',
  [ButtonStyle.Danger]: 'destructive',
  [ButtonStyle.Link]: 'secondary',
} as const;

export function Component({ component, id }: { component: APIActionRowComponentTypes; id: number }) {
  if (component.type === ComponentType.Button) {
    return (
      <DiscordButton
        key={id}
        type={ButtonStyleMapping[component.style!]}
        url={(component as APIButtonComponentWithURL).url ?? undefined}
        emoji={component.emoji ? parseDiscordEmoji(component.emoji) : undefined}
      >
        {component.label}
      </DiscordButton>
    );
  }

  return undefined;
}
